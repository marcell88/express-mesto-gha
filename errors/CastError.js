class CastError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'CastError';
    this.description = 'Data Not Found';
    this.statusCode = 404;
  }
}

module.exports = CastError;
