const newGetProductEndpoint = require('./getProduct');
const newRefreshDataEndpoint = require('./refreshData');

const InternalStorage = require('../internalStorage');

function initApi(redisClient, productFeedsConfig) {
  const internalStorage = new InternalStorage(redisClient);
  return {
    getProduct: newGetProductEndpoint(internalStorage),
    refreshData: newRefreshDataEndpoint(internalStorage, productFeedsConfig),
  };
}

module.exports = initApi;
