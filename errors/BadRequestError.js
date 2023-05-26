class BadRequestError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'BadRequestError';
    this.description = 'Submitted data is not correct';
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
