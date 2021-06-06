import { randomBytes } from "crypto";
import { Request, Router } from "express";
import { authorize } from "passport";
import { AccessToken } from "../entity/AccessToken";

export const AccessTokenRouter = Router();

const auth_types = ['basic'];

AccessTokenRouter.get('/', authorize(auth_types, { session: false }), async (req, res) => {
  try {
    let tokens = await AccessToken.find();
    res.status(200).send(tokens);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

AccessTokenRouter.post('/', authorize(auth_types, { session: false }), async (req: Request<unknown, unknown, { name: string }>, res) => {
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

AccessTokenRouter.delete('/:token', authorize(auth_types, { session: false }), async (req: Request<{ token: string }, unknown, unknown, unknown>, res) => {
  try {
    let del_res = await AccessToken.delete(req.params.token);
    res.sendStatus(del_res.affected != null && del_res.affected == 0 ? 404 : 200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});