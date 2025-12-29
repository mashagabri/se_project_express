module.exports = (err, _req, res, _next) => {
  console.log(
    `Error ${err.name} with the message ${err.message} has occurred while executing the code`
  );

  return res
    .status(err.statusCode ?? err.status ?? 400)
    .send({ message: err.message });
};
