require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const CreateAdmin = require("./utils/bootstrap");
const socket =require("./utils/socket")

let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  CreateAdmin();
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
  socket.connectSocket(server);
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});