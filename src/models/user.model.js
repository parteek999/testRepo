const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { userType } = require("../config/appConstant");

let socketId = mongoose.Schema({
  socket: { type: String },
  conversationId: { type: String }
});

const userSchema = mongoose.Schema(
  {
    countryCode: { type: String, default: ""},
    phoneNumber: { type: Number,default:0},
    password: { type: String, default: ""},
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    name: { type: String, trim: true },
    userType: {
      type: String,
      enum: [userType.ADMIN, userType.USER],
      default: userType.USER,
    },
    isBlocked: { type: Boolean, default: false },
    isDeleted:{ type: Boolean, default: false },
    socketId : [socketId],
    likedUsers:[{type:mongoose.Schema.ObjectId, ref: "users", index: true}]
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password,user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  user.name =
    user.name.trim()[0].toUpperCase() + user.name.slice(1).toLowerCase();

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


const User = mongoose.model("users", userSchema);

module.exports = User;

