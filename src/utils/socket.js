const { User, Chat, Conversation } = require("../models");
const socket = require("socket.io");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

let userCache = {};

exports.connectSocket = (server) => {
  io = socket(server);

  io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token,
        config.jwt.secret,
        function (err, decoded) {
          if (err) return next(new Error("Authentication error"));
          console.log("decoded", decoded);
          socket.decoded = decoded;
          let value = socket.decoded.sub;
          userCache[value] = socket.id;
          console.log("socketHolder", userCache);
          return next();
        }
      );
    } else {
      return next(new Error("Authentication error"));
    }
  }).on("connection", (socket) => {
  
    socket.on("sendMessage", async (data) => {
      console.log(
        "===================send Message====================== ",
        data,
        socket.decoded
      );

      const message = await saveMessage(
        socket.decoded.sub,
        data.receiverId,
        data.message,
        data.messageType,
        data.image
      );
      console.log("messageObj", message);

      const receiverSocketIds = userCache[data.receiverId];
    
      if (!receiverSocketIds) {
        return;
      }

      io.to(receiverSocketIds).emit("receiveMessage", message);
      console.log("receiverSocketIds", receiverSocketIds);
      
      
      // for aray of multiple deviceIds of deviceTokens
      // for (var i = 0; i < receiverSocketIds.length; i++) {
      //   io.to(receiverSocketIds[i]).emit("receiveMessage", message);
      // }


      
    });

    socket.on("error", function (error) {
      console.error(error);
    });

    socket.on("disconnect", () => {
      if (!socket.decoded || !socket.decoded.sub) {
        return;
      }

      const userId = socket.decoded.sub;
      const userSocketIds = userCache[userId];
      if (!userSocketIds) {
        return;
      }
      console.log("Socket Disconnect", userId, socket.id);
      delete userCache[userId];
    });
  });
};

///////////////////////////////////////// db functions /////////////////////////////////////////////
const saveMessage = async (
  senderId,
  receiverId,
  message,
  messageType,
  image
) => {
  let dataToSend = {};
  let createdAt = Date.now();

  const conversation = await Conversation.findOneAndUpdate(
    {
      $or: [
        { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
        { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
      ],
    },
    {
      $setOnInsert: { senderId: senderId, receiverId: receiverId },
    },
    {
      upsert: true,
      lean: true,
    }
  );
  console.log("conversation", conversation);
  dataToSend = {
    receiverId: receiverId,
    senderId: senderId,
    message: message,
    messageType: messageType,
    imageUrl: image,
    conversationId: conversation._id,
    createdAt: createdAt,
  };
  const messageData = await Chat.create(dataToSend);
 
  return messageData;

};
