import client from "./client";

export const ACTION_NAMES = [
  'DeleteAction',
  'DiscordWebhookAction',
  'ReplaceAction',
  'WebhookAction',
] as const;

export type ActionClassName = typeof ACTION_NAMES[number];

export interface BaseAction {
  className: ActionClassName;
  id: string,
  name: string,
  sender: string | null,
  inbox: string | null,
  subject: string | null,
  lastError: string | null,
  priority: number,
  active: boolean,
}

export interface DeleteAction extends BaseAction {
  className: 'DeleteAction',
}

export interface DiscordWebhookAction extends BaseAction {
  className: 'DiscordWebhookAction',
  webhookUrl: string,
}

export interface ReplaceAction extends BaseAction {
  className: 'ReplaceAction',
  regex: string,
  replacement: string,
}

export interface WebhookAction extends BaseAction {
  className: 'WebhookAction',
  webhookUrl: string,
}

export type Action = DeleteAction | DiscordWebhookAction | ReplaceAction | WebhookAction;

export type ActionForm = Omit<Action, 'id' | 'lastError'>;

export async function getActions() {
  return client.get<Action[]>('/action').then(res => res.data);
}

export async function addAction(action: ActionForm) {
  return client.post('/action', action);
}

export async function setActiveAction(data: {id: string, active: boolean}) {
  return client.post(`/action/${data.id}`, { active: data.active });
}

export async function deleteAction(id: string) {
  return client.delete(`/action/${id}`);
}