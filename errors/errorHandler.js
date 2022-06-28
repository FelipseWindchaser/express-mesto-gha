function ErrorHandler({ statusCode, message }) {
  this.statusCode = statusCode;
  this.message = message;
}

module.exports = ErrorHandler;
