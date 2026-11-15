export const OFFICIAL_PORTFOLIO_HOST = 'sidaps-portfolio.sidaps.workers.dev';
// A trailing DNS dot resolves to the same host but is a different browser/auth origin.
export function canonicalPortfolioUrl(input:string):string|null {
 const url=new URL(input);
 if(url.hostname!==OFFICIAL_PORTFOLIO_HOST+'.')return null;
 url.hostname=OFFICIAL_PORTFOLIO_HOST;
 return url.toString();
}
