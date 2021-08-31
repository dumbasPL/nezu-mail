import {Request, Router} from 'express';
import * as passport from 'passport';
import {ActionManager} from '../ActionManager';
import {Action} from '../entity/Action';
import {DeleteAction} from '../entity/actions/DeleteAction';
import {DiscordWebhookAction} from '../entity/actions/DiscordWebhookAction';
import {ReplaceAction} from '../entity/actions/ReplaceAction';
import {WebhookAction} from '../entity/actions/WebhookAction';

export const ActionRouter = Router();

const authTypes = ['basic'];

ActionRouter.get('/', passport.authorize(authTypes, {session: false}), async (req, res) => {
  try {
    const actions = await Action.find();
    res.status(200).send(actions);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

ActionRouter.post('/', passport.authorize(authTypes, {session: false}), async (req, res) => {
  try {
    let action: Action;
    switch (req.body.className) {
    case 'DeleteAction': action = new DeleteAction(); break;
    case 'DiscordWebhookAction': action = new DiscordWebhookAction(); break;
    case 'ReplaceAction': action = new ReplaceAction(); break;
    case 'WebhookAction': action = new WebhookAction(); break;
    default:
      return res.status(400).send('invalid className');
    }

    if (typeof(req.body.name) != 'string' || req.body.name.trim().length == 0) {
      return res.status(400).send('Missing name');
    }

    if (isNaN(parseInt(req.body.priority))) {
      return res.status(400).send('Invalid/missing priority');
    }

    action.name = req.body.name;

    action.sender = req.body.sender ?? '';
    action.sender = action.sender.length == 0 ? null : action.sender;

    action.inbox = req.body.inbox ?? '';
    action.inbox = action.inbox.length == 0 ? null : action.inbox;

    action.subject = req.body.subject ?? '';
    action.subject = action.subject.length == 0 ? null : action.subject;

    action.priority = parseInt(req.body.priority);

    if (action instanceof DiscordWebhookAction || action instanceof WebhookAction) {
      if (typeof(req.body.webhookUrl) != 'string' || req.body.webhookUrl.trim().length == 0) {
        return res.status(400).send('Missing webhookUrl');
      }
      action.webhookUrl = req.body.webhookUrl.trim();
    }

    if (action instanceof ReplaceAction) {
      if (typeof(req.body.regex) != 'string' || req.body.regex.trim().length == 0) {
        return res.status(400).send('Missing regex');
      }
      if (typeof(req.body.replacement) != 'string' || req.body.replacement.trim().length == 0) {
        return res.status(400).send('Missing replacement');
      }
      action.regex = req.body.regex.trim();
      action.replacement = req.body.replacement.trim();
    }

    await action.save();
    ActionManager.reload();
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

ActionRouter.post('/:id', passport.authorize(authTypes, {session: false}), async (req: Request<{ id: number }, unknown, any, unknown>, res) => {
  try {
    const action = await Action.findOne(req.params.id);
    if (!action) {
      return res.status(404).send('Action not found');
    }
    let {name, sender, inbox, subject, active} = req.body;

    if (typeof name == 'string') {
      name = name.trim();
      if (name.length == 0) {
        return res.status(400).send('name can not be empty');
      }
      action.name = name;
    }

    if (typeof sender == 'string') {
      action.sender = sender.trim();
    }

    if (typeof inbox == 'string') {
      action.inbox = inbox.trim();
    }

    if (typeof subject == 'string') {
      action.subject = subject.trim();
    }

    if (typeof active == 'boolean') {
      action.active = active;
    }

    await action.save();
    ActionManager.reload();
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

ActionRouter.delete('/:id', passport.authorize(authTypes, {session: false}), async (req: Request<{ id: number }, unknown, unknown, unknown>, res) => {
  try {
    const delRes = await Action.delete(req.params.id);
    ActionManager.reload();
    res.sendStatus(delRes.affected != null && delRes.affected == 0 ? 404 : 200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
