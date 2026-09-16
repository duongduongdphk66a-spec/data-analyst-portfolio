/**
 * Re-export proxy for Kami Ely Telemetry Data.
 * Fully backward-compatible while modules are cleanly separated in ./kami-ely/
 */
export * from './kami-ely';
export { KAMI_MATH_STATS, population, eda, hypothesis, correlation, timeSeries, skuMatrix } from './kami-ely/stats';
