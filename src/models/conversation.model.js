const mongoose = require("mongoose");

const conversation = mongoose.Schema(
  {
    senderId: { type:mongoose.Schema.ObjectId, ref: "users", index: true },
    receiverId: { type:mongoose.Schema.ObjectId, ref: "users", index: true },
  },
  {
    timestamps: true,
  }
);


const Conversation = mongoose.model("conversation", conversation);

module.exports = Conversation;
