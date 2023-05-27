const { HTTP_STATUS_NOT_FOUND } = require('node:http2').constants;

class DocumentNotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'DocumentNotFoundError';
    this.description = 'Data Not Found';
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = DocumentNotFoundError;
