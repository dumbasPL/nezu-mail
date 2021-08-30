import {Mail} from '../entity/Mail';
import * as passport from 'passport';
import {Request, Router} from 'express';
import {MailEvent} from '../MailEvent';

export const mailRouter = Router();

export const mailEvent = new MailEvent();

const authTypes = ['basic', 'bearer'];

interface GetMailsQuery {
  skip?: number;
  limit?: number;
  sender?: string;
  inbox?: string;
  subject?: string;
  search?: string;
}

mailRouter.get('/', passport.authenticate(authTypes, {session: false}), async (req: Request<unknown, unknown, unknown, GetMailsQuery>, res) => {
  try {
    const query = Mail.createQueryBuilder('mail');
    query.select([
      'mail.id',
      'mail.sender',
      'mail.inbox',
      'mail.subject',
      'mail.date',
    ]);

    if (req.query.sender) {
      query.andWhere('mail.sender = :sender', {sender: req.query.sender});
    }
    if (req.query.inbox) {
      query.andWhere('mail.inbox = :inbox', {inbox: req.query.inbox});
    }
    if (req.query.subject) {
      query.andWhere('mail.subject LIKE :q', {q: `%${req.query.subject.replace(/\*/g, '%')}%`});
    }
    if (req.query.search) {
      const q = `%${req.query.search.replace(/\*/g, '%')}%`;
      query.andWhere('mail.sender LIKE :s_search OR mail.inbox LIKE :i_search OR mail.subject LIKE :su_search', {s_search: q, i_search: q, su_search: q});
    }
    query.orderBy('mail.date', 'DESC');
    query.skip(req.query.skip ? req.query.skip : 0);
    query.take(req.query.limit ? req.query.limit : 25);
    const mails = await query.getMany();
    const count = await query.getCount();

    res.status(200).send({
      data: mails,
      total: count,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

interface WaitForMailQuery {
  sender?: string;
  inbox?: string;
  subject?: string;
  timeout?: number;
  delete?: string;
}

mailRouter.get('/wait', passport.authenticate(authTypes, {session: false}), (req: Request<unknown, unknown, unknown, WaitForMailQuery>, res) => {
  const onMail = (mail: Mail) => {
    if (req.query.sender && req.query.sender != mail.sender) {
      return;
    }
    if (req.query.inbox && req.query.inbox != mail.inbox) {
      return;
    }
    if (req.query.subject && !mail.subject.toLowerCase().includes(req.query.subject.toLowerCase())) {
      return;
    }
    mailEvent.removeListener('newMail', onMail);
    try {
      res.status(200).send(mail);
      if (req.query.delete && req.query.delete != 'false' && req.query.delete != '0') {
        mail.remove();
      }
    } catch (_) { }
  };
  mailEvent.on('newMail', onMail);
  setTimeout(() => {
    mailEvent.removeListener('newMail', onMail);
    try {
      res.sendStatus(408);
    } catch (_) { }
  }, (req.query.timeout ?? 10) * 1000);
});

mailRouter.get('/:id', passport.authenticate(authTypes, {session: false}), async (req: Request<{ id: number }, unknown, unknown, unknown>, res) => {
  try {
    const mail = await Mail.findOne(req.params.id);

    if (mail) {
      if (req.accepts('html')) {
        res.status(200).type('html').send(mail.body);
      } else {
        res.status(200).send(mail);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

mailRouter.delete('/:id', passport.authenticate(authTypes, {session: false}), async (req: Request<{ id: number }, unknown, unknown, unknown>, res) => {
  try {
    const delRes = await Mail.delete(req.params.id);

    res.sendStatus(delRes.affected != null && delRes.affected == 0 ? 404 : 200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
