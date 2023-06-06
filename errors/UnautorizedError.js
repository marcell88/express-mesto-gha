const { HTTP_STATUS_UNAUTHORIZED } = require('node:http2').constants;

class UnauthorizedError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'Unauthorized';
    this.description = 'User is not autorized';
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
