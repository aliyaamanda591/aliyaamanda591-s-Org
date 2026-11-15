import { portfolioStylesBaseHtml } from './portfolio/styles-base';
import { portfolioStylesComponentsHtml } from './portfolio/styles-components';
import { portfolioStylesResponsiveHtml } from './portfolio/styles-responsive';
import { portfolioHeadLinksHtml } from './portfolio/head-links';
import { portfolioShellDashboardHtml } from './portfolio/views/shell-dashboard';
import { portfolioTransactionsAssetsHtml } from './portfolio/views/transactions-assets';
import { portfolioDeveloperFooterHtml } from './portfolio/views/developer-footer';
import { portfolioCoreStateScriptHtml } from './portfolio/scripts/core-state';
import { portfolioCatalogStocksScriptHtml } from './portfolio/scripts/catalog-stocks';
import { portfolioCatalogCryptoScriptHtml } from './portfolio/scripts/catalog-crypto';
import { portfolioRenderOverviewScriptHtml } from './portfolio/scripts/render-overview';
import { portfolioPlatformCatalogScriptHtml } from './portfolio/scripts/platform-catalog';
import { portfolioRenderPricesScriptHtml } from './portfolio/scripts/render-prices';
import { portfolioTradesProfileScriptHtml } from './portfolio/scripts/trades-profile';
import { portfolioHostedAuthScriptHtml } from './portfolio/scripts/hosted-auth';
import { portfolioUsageGuideHtml } from './portfolio/usage-guide';

export const portfolioHtml =
  portfolioStylesBaseHtml +
  portfolioStylesComponentsHtml +
  portfolioStylesResponsiveHtml +
  portfolioHeadLinksHtml +
  portfolioShellDashboardHtml +
  portfolioTransactionsAssetsHtml +
  portfolioDeveloperFooterHtml +
  portfolioCoreStateScriptHtml +
  portfolioCatalogStocksScriptHtml +
  portfolioCatalogCryptoScriptHtml +
  portfolioRenderOverviewScriptHtml +
  portfolioPlatformCatalogScriptHtml +
  portfolioRenderPricesScriptHtml +
  portfolioTradesProfileScriptHtml +
  portfolioHostedAuthScriptHtml +
  portfolioUsageGuideHtml;
