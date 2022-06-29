const express = require("express");
const auth = require("../middlewares/auth");
const { validate, validateView } = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");
const { userType } = require("../config/appConstant");
const router = express.Router();

router.post("/signup",validate(userValidation.signup), userController.signup);

router.post("/login",validate(userValidation.login), userController.login);

router.get("/likedUser",auth(userType.USER),userController.likedUser);

router
  .route("/")
  .put(
    auth(userType.USER),
    validate(userValidation.editProfile),
    userController.editProfile
  );

router.get("/likedUsersConversation",auth(userType.USER),userController.likedUsersConversation)
  

module.exports = router;


//http://localhost:5000/users  //editProfile
//http://localhost:5000/users/likedUser   //likedUser
//http://localhost:5000/users/signup      //signup
//http://localhost:5000/users/login       //login
//http://localhost:5000/users/likedUsersConversation  