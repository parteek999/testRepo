const express = require("express");
const auth = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const chatValidation =require("../validations/chat.validation")
const chatController =require("../controllers/user.chat")
const { userType } = require("../config/appConstant");
const router = express.Router();

router.post("/startConversation",auth(userType.USER),validate(chatValidation.startConversation),chatController.startConversation)

router.get("/getChats", auth(userType.USER),validate(chatValidation.getChats),chatController.getChats)


module.exports = router;


//http://localhost:5000/chat/getChats?page=0&limit=10

//http://localhost:5000/chat/startConversation

// payload of startConversation
// [{"key":"userId","value":"616ea7a871593c191b15b1da","type":"text"},{"key":"timezone","value":"Asia/Kolkata","type":"text"}]