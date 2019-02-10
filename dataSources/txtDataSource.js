/* eslint no-continue: "off" */

const https = require('https');
const readline = require('readline');

const logger = require('../logger');
const getSeparator = require('../utils/separator');

function processHeader(line, shopConfig, separator) {
  const header = {};
  const columns = line.split(separator);

  for (let i = 0; i < columns.length; i += 1) {
    if (columns[i] === shopConfig.productIdColumnName) {
      header.productIdColumnIndex = i;
      continue;
    }

    if (columns[i] === shopConfig.priceColumnName) {
      header.priceColumnIndex = i;
      continue;
    }

    if (header.priceColumnIndex && header.productIdColumnIndex !== undefined) {
      break;
    }
  }

  return header;
}

function newTXTDataConsumer(internalStorage, shopConfig) {
  let header;

  const separator = getSeparator(shopConfig);
  return {
    process(line) {
      if (!header) {
        header = processHeader(line, shopConfig, separator);
        return;
      }

      const columns = line.split(separator);
      internalStorage.process(
        shopConfig.shopName,
        columns[header.productIdColumnIndex],
        columns[header.priceColumnIndex],
      );
    },
  };
}

function newTXTDataSource(shopConfig) {
  return {
    import(internalStorage) {
      logger.info(`[TXTDataSource] request to ${shopConfig.url}`);
      const txtDataConsumer = newTXTDataConsumer(internalStorage, shopConfig);
      https.get(shopConfig.url, (response) => {
        response.setEncoding('utf8');
        logger.info(`[TXTDataSource] Response from ${shopConfig.url}. Status Code: ${response.statusCode}`);

        let lastProcessingLine = Promise.resolve();
        const rl = readline.createInterface({ input: response });
        rl.on('line', (line) => {
          lastProcessingLine = lastProcessingLine.then(txtDataConsumer.process(line));
        });
        response.on('end', async () => {
          rl.close();
          await lastProcessingLine;
          await internalStorage.commit(shopConfig.shopName);
          logger.info(`[TXTDataSource] Finishing importing data for ${shopConfig.url}`);
        });
      });
    },
  };
}

module.exports = newTXTDataSource;
