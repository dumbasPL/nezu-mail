import client from "./client";

export async function getTokens() {
  return client.get<Array<{name: string, token: string}>>('/token').then(res => res.data);
}

export async function addToken(name: string) {
  return client.post('/token', { name });
}

export async function deleteToken(token: string) {
  return client.delete(`/token/${token}`);
}