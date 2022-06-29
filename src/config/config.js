const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
const { joi } = require("./appConstant");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    SENDER_EMAIL: Joi.string()
      .required()
      .description("verfication sender email"),
    SENDER_PASSWORD: Joi.string()
      .required()
      .description("verification sender password"),
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .default("development"),
    API_BASE_URL: Joi.string().required(),
    PORT: Joi.number(),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    JWT_VERIFICATION_LINK_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verification link token expires"),
    // S3_REGION:Joi.string().required().description("bucket region"),
    // S3_ACCESSKEYID:Joi.string().required().description("bucket region"),
    // S3_SECRETACCESSKEY:Joi.string().required().description("bucket region"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    verificationLinkExpirationMinutes:
      envVars.JWT_VERIFICATION_LINK_EXPIRATION_MINUTES,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
};
