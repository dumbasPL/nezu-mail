import { Form, FormControl } from 'react-bootstrap'

export abstract class Action {

  id!: number;

  name!: string;

  sender?: string;

  inbox?: string;

  subject?: string;

  lastError?: string;

  priority!: number;

  className!: string;

}

export class DeleteAction extends Action { }

export class DiscordWebhookAction extends Action {

  webhookUrl!: string;

}

export class WebhookAction extends Action {

  webhookUrl!: string;

}

export class ReplaceAction extends Action {

  regex!: string;

  replacement!: string;

}

export function getClassFromAny(obj: any) {
  if (typeof(obj.className) != "string") {
    throw new Error("missing className property");
  }

  switch (obj.className as string) {
    case "DeleteAction": return obj as DeleteAction;
    case "DiscordWebhookAction": return obj as DiscordWebhookAction;
    case "WebhookAction": return obj as WebhookAction;
    case "ReplaceAction": return obj as ReplaceAction;
    default: throw new Error(`invalid className ${obj.className}`);
  }
}

export function getActionNames() {
  return [
    'DeleteAction',
    'DiscordWebhookAction',
    'WebhookAction',
    'ReplaceAction'
  ]
}

export function getActionOptions(action: string | Action) {
  const display = typeof(action) != "string";
  switch (typeof(action) != "string" ? action.className : action) {
    case 'DeleteAction': return null;
    case 'DiscordWebhookAction':
    case 'WebhookAction':
    return (display ? 
        <p>Webhook url: <strong>{(action as WebhookAction).webhookUrl}</strong></p>:
        <Form.Group>
          <Form.Label>Webhook url</Form.Label>
          <FormControl required type="text" name="webhookUrl"/>
        </Form.Group>
    );
    case 'ReplaceAction': return ( display ? 
      <>
        <p>Regex: <strong>{(action as ReplaceAction).regex}</strong></p>
        <p>Replacement: <strong>{(action as ReplaceAction).replacement}</strong></p>
      </>:
      <>
        <Form.Group>
          <Form.Label>Regex</Form.Label>
          <FormControl required type="text" name="regex"/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Replacement</Form.Label>
          <FormControl required type="text" name="replacement"/>
        </Form.Group>
      </>
    )
  }
}