const mongoose = require("mongoose");
const { tokenTypes } = require("../config/appConstant");

const tokenSchema = mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFICATION_USER,
      ],
      required: true,
    },
    expires: { type: Date, required: true },
    blacklisted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;