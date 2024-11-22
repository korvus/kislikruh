
export const roundTo = (value, decimals = 2) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

export const levainDetector = new RegExp(/levain/im);

// export const viennoiserieDetector = new RegExp(/beurre sec/im);

export const liquidDetector = new RegExp(/eau|water|voda/im);

export const eggDetector = new RegExp(/\b(oeufs?|Œufs?|eggs?|jajca)\b(?! d'oeuf)/im);

export const farineDetector = new RegExp(/farine|flour|moka/im);