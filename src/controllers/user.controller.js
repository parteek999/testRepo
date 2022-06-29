const { tokenService } = require("../services");
const { userType } = require("../config/appConstant");
const {
  catchAsync,
  successMessage,
  formatUser,
  ApiError,
} = require("../utils/commonFunction");
const { User } = require("../models");
const httpStatus = require("http-status");

//--------------signUp------------//
const signup = catchAsync(async (req, res) => {
  let data = await User.findOne({ email: req.body.email });
  if (data) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Account is already exist please login"
    );
  }
  if (!data) {
    data = await User.create(req.body);
  }
  return res.send(successMessage(201, { msg: "Please Login" }));
});
//-------------end-----------//
//---------------login--------//
const login = catchAsync(async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  if (user.isBlocked) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your account is Blocked ");
  }
  if (user.isDeleted) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your account is Deleted");
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password does not match");
  }
  const token = await tokenService.generateAuthTokens(user, userType.USER);
  let formatedUser = formatUser(user.toObject());
  return res.send(successMessage(200, { token, user: formatedUser }));
});
//-------editProfile-----------//
const editProfile = catchAsync(async (req, res) => {
  const userId =req.user._id
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });
  const formatedUser = formatUser(updatedUser);
  return res.send(successMessage(200, { user: formatedUser }));
});
//---------likedUserListings------//
const likedUser =catchAsync(async (req, res) => {
  const userId =req.user._id
  const updatedUser = await User.findOne({_id:userId},{likedUsers:1},{lean:true}).populate("likedUsers");
  return res.send(successMessage(200, { user: updatedUser }));
});
//---------likedUserListings------//

const likedUsersConversation =catchAsync(async(req,res)=>{
  const userId =req.user._id;
  const updatedUser = await User.aggregate( [
    { $unwind: "$likedUsers" },
    { $lookup:
       {
         from: "conversation",
         localField: "likedUsers",
         foreignField: "senderId",
         as: "senderConversations"
       }
     }
] )
 
 
  return res.send(successMessage(200, { user: updatedUser }))

});


module.exports = {
  signup,
  login,
  editProfile,
  likedUser,
  likedUsersConversation
};