const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ]
});


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`),
      winston.format.colorize({ all: true }),
    ),
  }));
}

module.exports = logger;
