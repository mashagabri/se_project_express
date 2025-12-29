class ConflictError extends Error {
  constructor(message = null) {
    super(message ?? "Already exist error");
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
