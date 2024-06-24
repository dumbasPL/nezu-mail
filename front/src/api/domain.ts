import client from "./client";

export async function getDomains() {
  return client.get<string[]>('/domain').then(res => res.data);
}

export async function addDomain(domain: string) {
  return client.post('/domain', { domain });
}

export async function deleteDomain(domain: string) {
  return client.delete(`/domain/${domain}`);
}