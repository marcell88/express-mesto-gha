const { HTTP_STATUS_CONFLICT } = require('node:http2').constants;

class ConflictError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'Conflict error';
    this.description = 'The request could not be processed because of conflict in the request';
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
