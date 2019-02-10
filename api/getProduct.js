const logger = require('../logger');

function newGetProductEndpoint(internalStorage) {
  return (shopName, productId) => {
    logger.info(`[API] get product '${productId}' for shop '${shopName}'`);
    return internalStorage.getProductPrice(shopName, productId);
  };
}

module.exports = newGetProductEndpoint;
