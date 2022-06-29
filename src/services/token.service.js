const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const { tokenTypes } = require("../config/appConstant");
const Token = require("../models/token.model");
const userService = require("./user.service");
const httpStatus = require("http-status");
const { ApiError } = require("../utils/commonFunction");


const generateToken = (
  userId,
  expires,
  type,
  userType,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    role: userType,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    userId: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const generateAuthTokens = async (user, userType) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );

  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS,
    userType   
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );

  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
    userType
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};



const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  console.log("payload",payload)
  const tokenDoc = await Token.findOne({
    token,
    type: payload.type,
    userId: payload.sub,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};




// for refresh auth api and logout  

const refreshAuth = async (refreshToken) => {
  const refreshTokenDoc = await verifyToken(refreshToken);
  console.log("refreshTodf",refreshTokenDoc)
  const user = await userService.getUserById(refreshTokenDoc.userId);
  await refreshTokenDoc.remove();
  return generateAuthTokens(user,user.userType);
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  return await refreshTokenDoc.remove();
};



module.exports = {
  generateAuthTokens,
  saveToken,
  refreshAuth,
  logout
};
