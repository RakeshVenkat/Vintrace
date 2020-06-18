const sendDevError = (err, req, res) => {
  console.error(err);
  if (req.originalUrl.startsWith('/api')) {
    err.statusCode = err.statusCode || 500;
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  res.status(200).render('error', {
    title: 'Error | Something went wrong',
    msg: err.message,
  });
};

const sendProdError = (err, req, res) => {
  console.error(err);
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      err.statusCode = err.statusCode || 500;
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  }
  res.status(200).render('error', {
    title: 'Error | Something went wrong',
    msg:
      'This could be a broken link!!',
  });
  return res.status(500).json({
    status: 'fail',
    message: 'something went wrong!!',
  });
};

exports.globalErrorHandler = (err, req, res, next) => {
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === 'production') {
    const error = { ...err };
    error.message = err.message;

    return sendProdError(error, req, res);
  }
  return sendDevError(err, req, res);
};
