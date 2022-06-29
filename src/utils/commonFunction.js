
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const successMessage = (code, data) => {
  return { statusCode: code, status: "success", data };
};

// const formatUser = (userData) => {
//     delete userData.__v;
//     delete userData.password;
//     return userData;
// }

const formatUser = (userData) => {
  if (userData.length) {
    userData.forEach((data) => {
      delete data.__v;
      delete data.password;
    });
  } else {
    delete userData.__v;
    delete userData.password;
  }
  return userData;
};

module.exports = { ApiError, catchAsync, successMessage, formatUser };
