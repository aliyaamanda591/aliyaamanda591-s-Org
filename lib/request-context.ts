import { AsyncLocalStorage } from 'node:async_hooks';

const requestHeadersStorage = new AsyncLocalStorage<Headers>();

export function runWithRequestHeaders<T>(reqHeaders: Headers, fn: () => T): T {
  return requestHeadersStorage.run(reqHeaders, fn);
}

export function getRequestHeaders(): Headers {
  return requestHeadersStorage.getStore() ?? new Headers();
}

export async function headers(): Promise<Headers> {
  return getRequestHeaders();
}
