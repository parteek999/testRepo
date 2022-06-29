const Joi = require("joi");

const userType = {
  ADMIN: "Admin",
  USER: "User",
  AMIN_USER: "AMIN_USER",
};

const tokenTypes = {
  ACCESS: "access",
  REFRESH: "refresh",
  VERIFICATION_USER: "verificationPassword",
  RESET_PASSWORD: "resetPassword",
};


const joi = {
  COUNTRY_CODE: Joi.string().required(),
  PHONE_NUMBER: Joi.number().max(9999999999).min(1000000000).required(),
  EMAIL: Joi.string().email().lowercase().trim().required(),
  PASSWORD: Joi.string().min(6).required(),
  DOB: Joi.date().required(),
  GENDER: Joi.string().valid("MALE","FEMALE","OTHERS").required(),
  JOBTITLE: Joi.string().required(),
  NAME: Joi.string().required(),
  DESCRIPTION: Joi.string().required(),
  ADDRESS: Joi.string().required(),
  LONGITUDE: Joi.number().precision(8),
  LATITUDE: Joi.number().precision(8),
  LIMIT: Joi.number().default(10),
  PAGE: Joi.number().default(0),
  SEARCH: Joi.string().allow(""),
  ID:Joi.string().allow(""),
};

const statusCode ={
  success:200,
  created:201,
  badRequest:400
}

const MSG_TYPE= {
  TEXT: 1,
  IMAGE: 2,
}

module.exports = {
  userType,
  joi,
  tokenTypes,
  MSG_TYPE
};
