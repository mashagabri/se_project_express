class AuthorizationDeniedError extends Error {
  constructor(message = null) {
    super(message ?? "No token, authorization denied");
    this.statusCode = 401;
  }
}

module.exports = AuthorizationDeniedError;
