const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

//Complete the logging middleware
module.exports = (req, res, next) => {
  const requestId = Math.random().toString(36).substr(2, 9);
  req.requestId = requestId;
  req.startTime = Date.now();

  const { method, url } = req;
  const ip = req.ip || req.connection?.remoteAddress || '';
  const userAgent = req.get('User-Agent') || '';

  logger.info('Incoming request', {
    requestId,
    method,
    url,
    ip,
    userAgent
  });

  next(); // Continue to next middleware
};