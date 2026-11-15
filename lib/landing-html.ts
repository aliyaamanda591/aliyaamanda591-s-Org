import { marketWatchHtml } from './market-board-html.js';
import { landingHeadHtml } from './landing/head';
import { landingHeroHtml } from './landing/hero';
import { landingMarketBeforeHtml } from './landing/market-before';
import { landingFeaturesHtml } from './landing/features';
import { landingTutorialFaqFooterHtml } from './landing/tutorial-faq-footer';

export const landingHtml =
  landingHeadHtml +
  landingHeroHtml +
  landingMarketBeforeHtml +
  marketWatchHtml +
  landingFeaturesHtml +
  landingTutorialFaqFooterHtml;
