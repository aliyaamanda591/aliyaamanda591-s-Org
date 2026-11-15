import { hash, compare, truncates } from 'bcryptjs';
import { getRequestHeaders } from './request-context';

export const SESSION_COOKIE = 'sidaps_session';

export function randomToken(bytes = 32) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (x) =>
    x.toString(16).padStart(2, '0'),
  ).join('');
}

export async function digest(value: string) {
  const data = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(data), (x) => x.toString(16).padStart(2, '0')).join('');
}

export function canonicalEmail(value: unknown) {
  if (typeof value !== 'string') throw Error('Masukkan email yang valid.');
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw Error('Masukkan email yang valid.');
  }
  return email;
}

export function validatePassword(value: unknown): string {
  if (typeof value !== 'string' || value.length < 8) {
    throw Error('Password minimal 8 karakter.');
  }
  if (truncates(value)) {
    throw Error('Password terlalu panjang; maksimal 72 byte UTF-8.');
  }
  return value;
}

export async function hashPassword(value: unknown) {
  return hash(validatePassword(value), 12);
}

export async function checkPassword(value: unknown, encoded: string) {
  if (typeof value !== 'string' || truncates(value)) return false;
  return compare(value, encoded);
}

export function recoveryCode() {
  return randomToken(24).toUpperCase().match(/.{8}/g)!.join('-');
}

export function normalizedRecovery(value: unknown) {
  return typeof value === 'string' ? value.toUpperCase().replace(/[^A-F0-9]/g, '') : '';
}

export function sessionCookie(token: string, expires: number) {
  const hdrs = getRequestHeaders();
  const isHttps =
    hdrs.get('x-forwarded-proto')?.includes('https') ||
    hdrs.get('origin')?.startsWith('https://') ||
    false;
  const maxAge = Math.max(0, Math.floor((expires - Date.now()) / 1000));
  const security = isHttps ? 'Secure; SameSite=None' : 'SameSite=Lax';
  return `${SESSION_COOKIE}=${token}; HttpOnly; ${security}; Path=/; Max-Age=${maxAge}`;
}
