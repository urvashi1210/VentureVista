//Dealing with operational errors-predictable and not programming errors

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //super() is used to call the parent constructor and parent class here is error which has only one parameter message

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
//class AppError inherits from (built in) Error class

module.exports = AppError;
