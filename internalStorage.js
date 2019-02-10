const { promisify } = require('util');

class InternalStorage {
  constructor(redisClient) {
    this.redisClient = redisClient;
    this.tmpPrefix = Math.random().toString(36);

    this.getAsync = promisify(this.redisClient.hget).bind(this.redisClient);
    this.renameAsync = promisify(this.redisClient.rename).bind(this.redisClient);
    this.hsetAsync = promisify(this.redisClient.hset).bind(this.redisClient);
  }

  getProductPrice(shopName, productId) {
    return this.getAsync(shopName, productId);
  }

  commit(shopName) {
    return this.renameAsync(`${this.tmpPrefix}${shopName}`, shopName);
  }

  process(shopName, productId, price) {
    return this.hsetAsync(`${this.tmpPrefix}${shopName}`, productId, price);
  }
}

module.exports = InternalStorage;
