import client from "./client";

export interface Mail {
  id: number,
  sender: string,
  inbox: string,
  subject: string,
  date: string,
}

export interface MailWithBody extends Mail {
  body: string,
}

interface GetMailsRequest {
  page: number;
  perPage: number;
  search?: string;
  sender?: string;
  inbox?: string;
  signal?: AbortSignal;
}

export async function getMails(params: GetMailsRequest) {
  return client.get<{total: number, data: Mail[]}>('/mail', {
    params: {
      skip: params.page * params.perPage,
      limit: params.perPage,
      search: params.search,
      sender: params.sender,
      inbox: params.inbox,
    },
    signal: params.signal,
  }).then(res => res.data);
}

export async function getMail(id: number) {
  if (isNaN(id)) {
    throw new Error('Invalid id');
  }
  return client.get<MailWithBody>(`/mail/${id}`, {
    headers: {
      accept: 'application/json'
    },
  }).then(res => res.data);
}

export async function deleteMail(id: number) {
  if (isNaN(id)) {
    throw new Error('Invalid id');
  }
  return client.delete(`/mail/${id}`);
}