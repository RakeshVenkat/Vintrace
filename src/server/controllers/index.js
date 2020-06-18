const AppError = require('../utils/appError');

exports.baseRouteHandler = (req, res) => {
  res.send({
    title: 'This is a healthcheck route.',
  });
};

exports.notFoundHandler = (req, res, next) => {
  next(new AppError(404, `Couldn't find ${req.originalUrl} on this server!!`));
};
