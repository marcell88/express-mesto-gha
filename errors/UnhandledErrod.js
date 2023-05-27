const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('node:http2').constants;

class UnhandledError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'Internal Server Error';
    this.description = 'Something wrong at server...';
    this.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

module.exports = UnhandledError;
