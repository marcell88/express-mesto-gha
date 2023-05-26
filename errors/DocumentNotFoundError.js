class DocumentNotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'DocumentNotFoundError';
    this.description = 'Data Not Found';
    this.statusCode = 404;
  }
}

module.exports = DocumentNotFoundError;
