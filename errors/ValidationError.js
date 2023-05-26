class ValidationError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'ValidationError';
    this.description = 'Submitted data is not correct';
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
