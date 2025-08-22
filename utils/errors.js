exports.errorRoutes = {
  message: "Requested resource not found",
};

module.exports = {
  BAD_REQUEST: 400,
  AUTHORIZATION_DENIED: 401,
  ACCESS_ERROR: 403,
  NOT_FOUND: 404,
  CONFLICT_ERROR: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVER_ERROR_MESSAGE: "An error has occurred on the server.",
  AUTHORIZATION_DENIED_MESSAGE: "No token, authorization denied",
  INVALID_TOKEN: "Invalid token",
};
