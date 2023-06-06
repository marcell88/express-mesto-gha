const { HTTP_STATUS_FORBIDDEN } = require('node:http2').constants;

class ForbiddenError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'Forbidden';
    this.description = 'Access is forbidden';
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
