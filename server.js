const express = require('express');
const logger = require('./logger');

function initServer(api, host, port) {
  if (!host || !port) {
    throw new Error(`Wrong config for http server ${host}:${port}`);
  }
  const app = express();

  app.get('/', async (req, res) => {
    const shopName = req.query.shopname;
    const productId = req.query.product_id;

    if (!shopName) {
      logger.warn('Incoming GET request with missing "shopname" query param');
      return res.type('json')
        .status(400)
        .send({ error: 'Bad Request', reason: 'Query Param "shopname" is required' });
    }

    if (!productId) {
      logger.warn('Incoming GET request with missing "product_id" query param');
      return res.type('json')
        .status(400)
        .send({ error: 'Bad Request', reason: 'Query Param "product_id" is required' });
    }

    try {
      const productPrice = await api.getProduct(shopName, productId);
      if (!productPrice) {
        return res.type('json')
          .status(404)
          .send({
            error: 'Product Not Found',
            reason: `There is no data for shop "${shopName}" and product "${productId}"`
          });
      }
      return res.type('json')
        .status(200)
        .send({ [productId]: productPrice });
    } catch(e) {
      return res.type('json')
        .status(500)
        .send({ error: 'Internal Server Error', reason: e.reason });
    }
  });

  app.post('/', (req, res) => {
    api.refreshData();
    res.type('json')
      .status(200)
      .send({ ok: true, info: 'Importing process is started' });
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
