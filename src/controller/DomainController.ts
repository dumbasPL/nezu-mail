import {Request, Router} from 'express';
import * as passport from 'passport';
import {Domain} from '../entity/Domain';

export const DomainRouter = Router();

const authTypes = ['basic'];

DomainRouter.get('/', passport.authorize(authTypes, {session: false}), async (req, res) => {
  try {
    const domains = await Domain.find();
    res.status(200).send(domains.map(x => x.domain));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

DomainRouter.post('/', passport.authorize(authTypes, {session: false}), async (req: Request<unknown, unknown, { domain: string }>, res) => {
  try {
    if (!req.body.domain) {
      return res.sendStatus(400);
    }

    const domain = new Domain();
    domain.domain = req.body.domain;
    await domain.save();

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

DomainRouter.delete('/:domain', passport.authorize(authTypes, {session: false}), async (req: Request<{ domain: string }, unknown, unknown, unknown>, res) => {
  try {
    const delRes = await Domain.delete(req.params.domain);
    res.sendStatus(delRes.affected != null && delRes.affected == 0 ? 404 : 200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
