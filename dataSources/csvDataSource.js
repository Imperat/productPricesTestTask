const https = require('https');
const logger = require('../logger');
const readline = require('readline');

const SEPARATOR_FOR_CSV = ';';

function processHeader(line, shopConfig) {
  const header = {};
  const columns = line.split(SEPARATOR_FOR_CSV);

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

function newCSVDataConsumer(internalStorage, shopConfig) {
  let header;
  return {
    process(line) {
      if (!header) {
        header = processHeader(line, shopConfig);
        return;
      }

      const columns = line.split(SEPARATOR_FOR_CSV);
      internalStorage.process(
        shopConfig.shopName,
        columns[header.productIdColumnIndex],
        Number(columns[header.priceColumnIndex]),
      );
    },
  };
}

function newCSVDataSource(shopConfig) {
  return {
    import(internalStorage) {
      logger.info(`[CSVDataSource] request to ${shopConfig.url}`);
      const csvDataConsumer = newCSVDataConsumer(internalStorage, shopConfig);
      https.get(shopConfig.url, (response) => {
        response.setEncoding('utf8');
        logger.info(`[CSVDataSource] Response from ${shopConfig.url}. Status Code: ${response.statusCode}`);

        const rl = readline.createInterface({ input: response });
        rl.on('line', line => csvDataConsumer.process(line));
        response.on('end', () => {
          rl.close();
          internalStorage.commit();
          logger.info(`[CSVDataSource] Finishing importing data for ${shopConfig.url}`);
        });
      });
    }
  };
}

module.exports = newCSVDataSource;
