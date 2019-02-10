const redis = require('redis');
const logger = require('./logger');

function initRedisClient(host, port) {
  if (!host || !port) {
    logger.error(`Wrong configuration for redis host and port: '${host}:${port}'`);
    throw new Error(`Wrong config for redis: ${host}:${port}`);
  }

  return new Promise((resolve, reject) => {
    const client = redis.createClient({ host, port });
    client.on('error', e => reject(e));
    client.on('connect', () => {
      logger.info('Successfully connected to Redis Server');
      return resolve(client);
    });
  });
}

module.exports = initRedisClient;
