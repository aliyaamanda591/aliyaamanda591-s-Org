import { validateFinancialData } from './financial-validation.js';
import { safeGooglePhoto } from './profile-photo.js';
export type PortfolioState = {
  transactions: Record<string, unknown>[];
  assets: Record<string, unknown>[];
  profile: { displayName: string; photo: string; googlePhoto?:string; photoMode?:'google'|'custom'|'none' };
  logs: { t: string; m: string }[];
  sheetUrl: string;
  lastBackup: string;
};
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const finite = (value: unknown) => typeof value === "number" && Number.isFinite(value);
const string = (value: unknown, limit: number) => typeof value === "string" && value.length <= limit;
export function validateState(raw: unknown): PortfolioState {
  const { transactions, assets } = validateFinancialData(raw);
  const input = raw as Record<string, unknown>;
  const p = object(input.profile) ? input.profile : {};
  const photo = typeof p.photo === "string" && p.photo.length <= 512000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.photo) ? p.photo : "";
  const googlePhoto=safeGooglePhoto(p.googlePhoto),photoMode=['google','custom','none'].includes(String(p.photoMode))?p.photoMode as 'google'|'custom'|'none':undefined;
  const profile = { displayName: typeof p.displayName === "string" ? p.displayName.trim().slice(0, 60) : "", photo,...(googlePhoto?{googlePhoto}:{}),...(photoMode?{photoMode}:{}) };
  const logs = (Array.isArray(input.logs) ? input.logs : []).filter(l => object(l) && string(l.m, 500) && typeof l.t === "string" && Number.isFinite(Date.parse(l.t))).slice(0, 60).map(l => ({ t: l.t as string, m: l.m as string }));
  return { transactions, assets, profile, logs, sheetUrl: string(input.sheetUrl, 1500) ? input.sheetUrl as string : "", lastBackup: string(input.lastBackup, 60) ? input.lastBackup as string : "" };
}
