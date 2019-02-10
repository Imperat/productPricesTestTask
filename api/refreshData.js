const logger = require('../logger');
const newTXTDataSource = require('../dataSources/txtDataSource');

const formatToDataSourceCreator = {
  csv: newTXTDataSource,
  txt: newTXTDataSource,
};

function newRefreshDataEndpoint(internalStorage, productFeedsConfig) {
  const refreshDataForShop = (shopName) => {
    const configs = productFeedsConfig[shopName];
    const dataSourceCreator = formatToDataSourceCreator[configs.format];
    if (!dataSourceCreator) {
      logger.warn(`[API] For shop ${shopName} unsupported format is configured: ${configs.format}`);
      logger.warn(`[API] Skipping importing data for ${shopName}`);
      return new Promise(resolve => resolve());
    }

    const dataSource = dataSourceCreator({ shopName, ...configs });
    logger.info(`[API] Starting importing data for ${shopName}`);
    return dataSource.import(internalStorage);
  };

  return () => {
    const shops = Object.keys(productFeedsConfig);
    logger.info(`[API] Starting refresh data for shops: ${shops.join(', ')}`);
    return Promise.all(shops.map(refreshDataForShop));
  };
}

module.exports = newRefreshDataEndpoint;
