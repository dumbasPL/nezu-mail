import * as dotenv from 'dotenv';
import 'reflect-metadata';
import {createConnection} from 'typeorm';
import * as express from 'express';
import {SMTPServer} from 'smtp-server';
import {simpleParser} from 'mailparser';
import * as passport from 'passport';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {BasicStrategy} from 'passport-http';
import {Mail} from './entity/Mail';
import {AccessToken} from './entity/AccessToken';
import * as path from 'path';
import {authenticate} from 'passport';
import {ActionManager} from './ActionManager';
import {Domain} from './entity/Domain';
import {mailEvent, mailRouter} from './controller/MailController';
import {AccessTokenRouter} from './controller/AccessTokenController';
import {DomainRouter} from './controller/DomainController';
import {ActionRouter} from './controller/ActionController';
import {createServer} from 'http';
import {Server} from 'socket.io';

dotenv.config();

// basic auth
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(
  new BasicStrategy((username, password, done) => {
    if (username != process.env.ADMIN_USER || password != process.env.ADMIN_PASSWORD) {
      done(null, false);
    } else {
      done(null, username);
    }
  })
);

// token auth
passport.use(
  new BearerStrategy((token, done) => {
    AccessToken.findOne(token).then(t => {
      done(null, t ?? false);
    }).catch(e => {
      done(e.message);
      console.log(e);
    });
  })
);

createConnection({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  username: process.env.MYSQL_USER || 'test',
  password: process.env.MYSQL_PASSWORD || 'test',
  database: process.env.MYSQL_DATABASE || 'test',
  synchronize: process.env.NODE_ENV == 'development',
  logging: false,
  charset: 'utf8mb4',
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
}).then(async connection => {
  if (process.env.NODE_ENV != 'development') {
    await connection.runMigrations();
  }

  ActionManager.reload();

  const app = express();
  const server = createServer(app);

  const io = new Server(server);

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api/mail', mailRouter);
  app.use('/api/token', AccessTokenRouter);
  app.use('/api/domain', DomainRouter);
  app.use('/api/action', ActionRouter);

  app.use('/api/*', (req, res, next) => res.sendStatus(404));

  app.use('/', authenticate('basic', {session: false}), express.static(path.join(__dirname, '..', 'front', 'build')));

  app.get('*', authenticate('basic', {session: false}), (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'front', 'build', 'index.html'));
  });


  io.use((socket, next) => {
    passport.authorize('basic', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (user) {
        socket.data.user = user;
        return next();
      }
      const {token} = socket.handshake.auth;
      if (!token) {
        return next(new Error('Unauthorized'));
      }
      AccessToken.findOne(token).then(t => {
        socket.data.user = t?.token;
        next(t != null ? null : new Error('Invalid token'));
      }).catch(e => {
        next(e);
        console.log(e);
      });
    })(socket.request);
  });

  mailEvent.on('newMail', mail => {
    io.emit('mail', mail);
  });

  server.listen(process.env.HTTP_PORT ?? 3000, () => {
    console.log(`Express server has started on port ${process.env.HTTP_PORT ?? 3000}`);
  });

  const smtpServer = new SMTPServer({
    onData(stream, session, callback) {
      simpleParser(stream, {}, async (err, parsed) => {
        if (err) {
          return console.log(err);
        }
        try {
          let mail = new Mail();
          mail.date = parsed.date ?? new Date();
          mail.sender = parsed.from?.value[0]?.address ?? '';
          if (parsed.to instanceof Array) {
            mail.inbox = parsed.to[0]?.value[0]?.address ?? '';
          } else {
            mail.inbox = parsed.to?.value[0]?.address ?? '';
          }
          mail.subject = parsed.subject ?? '';
          mail.body = parsed.html || parsed.text || '';

          const domain = mail.inbox.substring(mail.inbox.lastIndexOf('@') + 1);
          if (await Domain.findOne({domain})) {
            mail = await mail.save();
            console.log(`New Mail: ${mail.sender} -> ${mail.inbox}: ${mail.subject}`);
            if (ActionManager.run(mail)) {
              mailEvent.emitNewMail(mail);
            }
          } else {
            console.log(`domain ${domain} not in whitelist`);
          }
        } catch (e) {
          console.log(e);
        }
      });
      stream.on('end', callback);
    },
    disabledCommands: ['AUTH'],
  });

  smtpServer.listen(process.env.SMTP_PORT || 25, () => {
    console.log(`SMTP server has started on port ${process.env.SMTP_PORT || 25}`);
  });
}).catch(error => console.log(error));
