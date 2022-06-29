const passport = require("passport");
const httpStatus = require("http-status");
const { ApiError } = require("../utils/commonFunction");
const { request } = require("express");
const { userType } = require("../config/appConstant")

const verifyCallback =(req, resolve, reject, role) => async (err, user, info) => {
    // console.log("-------", user);
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    if (user.isBlocked) {
      return reject(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Your account is blocked please contact to admin"
        )
      );
    }
    if (user.isDeleted) {
      return reject(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Your account is Deleted please contact to admin"
        )
      );
    }
    if(role==userType.AMIN_USER){
      req.user = user;
      resolve();
    }
    if (user.role != role) {
      return reject(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not  authorize to perform this action"
        )
      );
    }
    req.user = user;
    resolve();
  };

  
const auth = (role) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject, role)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};


module.exports = auth;
