class AccessError extends Error {
  constructor(message = null) {
    super(message ?? "Invalid token");
    this.statusCode = 403;
  }
}

module.exports = AccessError;
