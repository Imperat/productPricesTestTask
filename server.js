const express = require('express');
const logger = require('./logger');

function initServer(api, host, port) {
  if (!host || !port) {
    throw new Error(`Wrong config for http server ${host}:${port}`);
  }
  const app = express();

  app.get('/', (req, res) => {
    api.getProduct();
  });

  app.post('/', (req, res) => {
    api.refreshData();
  });

  return new Promise((resolve, reject) => {
    app.listen({ port, host }, () => {
      logger.info(`http server listening on ${host}:${port}`);
      return resolve();
    })
      .on('error', (e) => reject(e));
  });
}

module.exports = initServer;
