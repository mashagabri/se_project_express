class NotFoundError extends Error {
  constructor(message = null) {
    super(message ?? "Undefined URL");
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
