module.exports = ((err, req, res, next) => {
  console.log('Attention! Default error handler has activated...');
  res.status(err.statusCode).send({
    message: err.message,
  });
});
