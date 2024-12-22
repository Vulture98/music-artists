import winston from 'winston';


// Create a logger instance
const Logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ] : [
      // In development, logging everything -> (debug level and above) to dev.log
      new winston.transports.File({ filename: 'dev.log', level: 'debug' })
    ]),
  ],
});


export default Logger;
