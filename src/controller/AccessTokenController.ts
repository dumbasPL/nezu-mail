import {randomBytes} from 'crypto';
import {Request, Router} from 'express';
import * as passport from 'passport';
import {AccessToken} from '../entity/AccessToken';

export const AccessTokenRouter = Router();

const authTypes = ['basic'];

AccessTokenRouter.get('/', passport.authorize(authTypes, {session: false}), async (req, res) => {
  try {
    const tokens = await AccessToken.find();
    res.status(200).send(tokens);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

AccessTokenRouter.post('/', passport.authorize(authTypes, {session: false}), async (req: Request<unknown, unknown, { name: string }>, res) => {
  try {
    if (!req.body.name) {
      return res.sendStatus(400);
    }

    const token = randomBytes(16).toString('hex');

    const accessToken = new AccessToken();
    accessToken.name = req.body.name;
    accessToken.token = token;
    await accessToken.save();

    res.status(200).send(accessToken);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

AccessTokenRouter.delete('/:token', passport.authorize(authTypes, {session: false}), async (req: Request<{ token: string }, unknown, unknown, unknown>, res) => {
  try {
    const delRes = await AccessToken.delete(req.params.token);
    res.sendStatus(delRes.affected != null && delRes.affected == 0 ? 404 : 200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
