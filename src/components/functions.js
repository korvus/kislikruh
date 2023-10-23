export const roundTo = (value, decimals = 2) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

export const levainDetector = new RegExp(/levain/im);

export const viennoiserieDetector = new RegExp(/beurre sec/im);

