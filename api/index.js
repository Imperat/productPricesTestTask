const newGetProductEndpoint = require('./getProduct');
const newRefreshDataEndpoint = require('./refreshData');

function initApi(redisClient, productFeedsConfig) {
  return {
    getProduct: newGetProductEndpoint(redisClient),
    refreshData: newRefreshDataEndpoint(redisClient, productFeedsConfig),
  };
}

module.exports = initApi;
