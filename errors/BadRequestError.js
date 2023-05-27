const { HTTP_STATUS_BAD_REQUEST } = require('node:http2').constants;

class BadRequestError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'BadRequestError';
    this.description = 'Submitted data is not correct';
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
