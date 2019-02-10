const inputFormats = require('../declarations/inputFormats');

function getSeparator(shopConfig) {
  if (shopConfig.format === inputFormats.CSV) {
    return ';';
  }

  return shopConfig.separator;
}

module.exports = getSeparator;
