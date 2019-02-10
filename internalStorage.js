class InternalStorage {
  constructor(redisClient) {
    this.redisClient = redisClient;
    this.tmpPrefix = Math.random().toString(36);
  }

  getProductPrice(shopName, productId) {
    return this.redisClient.hget(shopName, productId);
  }

  commit(shopName) {
    this.redisClient.rename(`${this.tmpPrefix}${shopName}`, shopName);
  }

  process(shopName, productId, price) {
    this.redisClient.hset(`${this.tmpPrefix}${shopName}`, productId, price);
    console.log(`${this.tmpPrefix}${shopName}`, productId, price);
  }
}

module.exports = InternalStorage;
