const Joi = require("joi");
const { joi } = require("../config/appConstant");


exports.startConversation = {
    body: Joi.object().keys({
      userId: Joi.string().required(),
      timezone: Joi.string().optional(),
      page:joi.PAGE,
      limit:joi.LIMIT
    }),
  };
  
exports.getChats = {
    query: Joi.object().keys({
      page:joi.PAGE,
      limit:joi.LIMIT
    }),
  };