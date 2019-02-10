function getSeparator(shopConfig) {
  if (shopConfig.format === 'csv') {
    return ';';
  }

  return shopConfig.separator;
}

module.exports = getSeparator;
