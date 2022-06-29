const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const compression = require("compression");
const helmet = require("helmet");
const { authLimiter } = require("./middlewares/rateLimiter");
const httpStatus = require("http-status");
const socket =require("./utils/socket");

const {
  ApiError,
} = require("../src/utils/commonFunction");
const path = require('path');

const app = express();

app.set("view engine", "hbs");
app.set('views', path.join(__dirname, '/../views'));
// console.log(path.join(__dirname, '/../views'))

app.set("socket",socket)

// parse json request body
app.use(express.json({limit: '1000mb'}));

// parse urlencoded request body
app.use(express.urlencoded({limit: '1000mb', extended: true}));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
app.use("/users", authLimiter);

// v1 api routes
app.use("/", routes);

//send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});
//hello neha
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
