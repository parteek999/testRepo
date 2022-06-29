const mongoose = require("mongoose");
const { MSG_TYPE} = require("../config/appConstant");

const chat = mongoose.Schema(
  {
    senderId:{type:mongoose.Schema.ObjectId, ref: "users"},
    receiverId: {type:mongoose.Schema.ObjectId, ref: "users"},   
    createdAt:{type:Number,default:Date.now()},
    conversationId:{type:String,default:"", index:true},
    message: {type: String,default:""},
    imageUrl:{type: String,default:""},
    messageType: {
        type: Number,default: MSG_TYPE.TEXT, enum: [
        MSG_TYPE.TEXT,
        MSG_TYPE.IMAGE,
        ]
    },
    deletedBy:{type:Array, default:[]},
    userType:{type:String,default:"USER"}
  }
);

const Chat = mongoose.model("chat", chat);
module.exports = Chat;
