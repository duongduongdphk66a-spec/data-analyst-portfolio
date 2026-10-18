/**
 * Re-export proxy for Library Bus Case Study Data.
 * Fully backward-compatible while modules are cleanly separated in ./library-bus/
 */

export {
  PORTFOLIO_PALETTE,
  NEO_BAKERY,
  ABOUT_US_DATA,
  UX_RESEARCH_DATA,
  BRAND_IDENTITY_DATA,
  NEO_BAKERY_TOKENS,
} from './library-bus/brandAndResearch';

export {
  LIBRARY_BUS_20_SCREENS,
  LIBRARY_BUS_MOBILE_SCREENS,
  type LibraryBusScreenItem,
} from './library-bus/screens';

export { WEBSITE_DESIGN_DATA } from './library-bus/architectureAndMetrics';
