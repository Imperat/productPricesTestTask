const redis = require('redis');
const logger = require('./logger');

function initRedisClient(host, port) {
  if (!host || !port) {
    logger.error(`Wrong configuration for redis host and port: '${host}:${port}'`);
  }

  return new Promise((resolve, reject) => {
    const client = redis.createClient({ host, port });
    client.on('error', e => reject(e));
    client.on('connect', () => resolve(client));
  });
}

module.exports = initRedisClient;
