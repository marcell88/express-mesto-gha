class UnhandledError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'UnhandledError';
    this.description = 'Something wrong at server...';
    this.statusCode = 500;
  }
}

module.exports = UnhandledError;
