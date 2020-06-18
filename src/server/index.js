require('dotenv').config();

const express = require('express');

// TODO:: Production mode is configured in server startup script: start
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHADLED EXCEPTION! Shutting down...');

  process.exit(1);
});

const app = require('./app');

// app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

// Server startup
const server = app.listen(process.env.SERVER_PORT, () => console.log(
  `Server runnning in ${process.env.NODE_ENV} mode at http://${process.env.HOSTNAME}:${process.env.SERVER_PORT}`
));

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHADLED REJECTION! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
