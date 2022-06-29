const Joi = require("joi");
const { joi } = require("../config/appConstant");



exports.signup = {
  body: Joi.object().keys({
    name: joi.NAME,
    email: joi.EMAIL,
    phoneNumber: joi.PHONE_NUMBER,
    countryCode: joi.COUNTRY_CODE,
    password: joi.PASSWORD,
  }),
};

exports.login = {
  body: Joi.object().keys({
    email: joi.EMAIL,
    password: joi.PASSWORD,
  }),
};

exports.editProfile = {
  body: Joi.object().keys({
    name: Joi.string().allow(""),
    phoneNumber: Joi.number().allow(""),
    countryCode: Joi.string().allow("")
  }),
};



            