const logger = require('./logger');
const yaml = require('js-yaml');
const fs = require('fs');
const initRedisClient = require('./redisClient');

async function runService() {
  logger.info('Starting service');

  let settings;
  let productFeeds;
  try {
    settings = yaml.safeLoad(fs.readFileSync('./settings.yaml', 'utf8'));
    productFeeds = yaml.safeLoad(fs.readFileSync('./productfeeds.yaml', 'utf8'));
  } catch(e) {
    logger.error(e.message);
    logger.error('Cann\'t start service. Error by loading settings and productfeeds config');
    throw e;
  }

  let redisClient;
  try {
    redisClient = await initRedisClient(settings.redisHost, settings.redisPort);
  } catch(e) {
    logger.error(e.message);
    logger.error('Cann\'t start service. Error by connection to redis server');
    throw e;
  }
}

runService()
  .then(() => logger.info('Service started'))
  .catch((e) => {
    logger.info('Service stopped due to critical error');
    process.exit(1);
});
