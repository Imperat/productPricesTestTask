const logger = require('./logger');
const yaml = require('js-yaml');
const fs = require('fs');
const initRedisClient = require('./redisClient');
const initServer = require('./server');

const SETTINGS_FILE_PATH = './config/settings.yaml';
const PRODUCTFEEDS_FILE_PATH = './config/productfeeds.yaml';
const CONFIGS_ENCODING = 'utf8';

async function runService() {
  logger.info('Starting service');

  let settings;
  let productFeeds;
  try {
    settings = yaml.safeLoad(fs.readFileSync(SETTINGS_FILE_PATH, CONFIGS_ENCODING));
    productFeeds = yaml.safeLoad(fs.readFileSync(PRODUCTFEEDS_FILE_PATH, CONFIGS_ENCODING));
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

  let server;
  try {
    server = await initServer(settings.host, settings.port);
  } catch(e) {
    logger.error(e.message);
    logger.error(`Cann\' listen on ${settings.host}:${settings.port}`);
    throw e;
  }
}

runService()
  .then(() => logger.info('Service started'))
  .catch((e) => {
    logger.info('Service stopped due to critical error', e);
    process.exit(1);
});
