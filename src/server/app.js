const express = require('express');
const fs = require('fs');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const app = express();
const baseRouter = require('./routes');
const wineRouter = require('./routes/wineRouter');

const { notFoundHandler } = require('./controllers');
const { globalErrorHandler } = require('./controllers/errorController');

// 1) Global Middlewares
// Set Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
// Body parser: Body larger than 10kb will not accespted
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against XSS attack (any HTML js code)
app.use(xssClean());

// Serving static files
const staticFileDirectory = path.join(process.cwd(), 'public');
app.use(express.static(staticFileDirectory));

// Prevent parameter pollution : uses the last one
// Whitelist some fields that you dont want hpp to filter
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// Rate limiting Middleware
// Allow only 100 requests in total within a window of 15 mins for all routes under /api
// Avoid denial of service attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use('/api/', apiLimiter); // only apply to requests that begin with /api/

// 2) Routes
// View
//app.use('/', viewRouter);

// API
app.use('/api/v1', baseRouter);
app.use('/api/v1/wine', wineRouter);


// Not found route handler
app.all('*', notFoundHandler);

// Inject the global error middleware
app.use(globalErrorHandler);

module.exports = app;
