const { userService } = require("../services");

const { catchAsync, successMessage } = require("../utils/commonFunction");
const { Chat, Conversation } = require("../models");

const startConversation = catchAsync(async (req, res) => {
  console.log("hello Testing", req.body);

  let userId = req.body.userId;
  let messages = [];

  let conversation = await Conversation.findOne(
    {
      $or: [
        { $and: [{ senderId: userId }, { receiverId: req.user._id }] },
        { $and: [{ senderId: req.user._id }, { receiverId: userId }] },
      ],
    },
    { _id: 1 },
    { lean: true }
  );

  console.log("conversation between users  ", conversation);

  if (conversation) {
    console.log("hihuhoiu", conversation);
    let criteria = {
      conversationId: conversation._id,
    };
    console.log("criteria", criteria);
  
    let populate = [
      {
        path: "senderId",
        select: "_id name",
      },
      {
        path: "receiverId",
        select: "_id name ",
      },
    ];

    let options = {
      limit: req.body.limit,
      sort: { createdAt: -1 },
      lean: true,
      skip: req.body.limit * req.body.page,
    };

    let data = await Chat.find(criteria, {}, options).populate(populate);

    return res.send(
      successMessage(200, { conversationId: conversation._id, messages: data })
    );
  } else {
    return res.send(
      successMessage(200, {
        conversationId: "",
        messages: messages,
      })
    );
  }
});

const getChats = catchAsync(async (req, res) => {
  console.log("LLLLLLLLLLLLLL   ", req.query);
  console.log("yyyyyyyyyy", req.user);

  let options = {
    limit: 1,
    sort: { createdAt: -1 },
    lean: true,
  };

  let chat = [],
    otherUserId;

  //get all user conversations
  let userConversations = await Conversation.find(
    { $or: [{ senderId: req.user._id }, { receiverId: req.user._id }] },
    {},
    { lean: true }
  );

  console.log("userConversation", userConversations);

  if (userConversations.length) {
    for (let i = 0; i < userConversations.length; i++) {
      let conversation = userConversations[i];

      if (conversation.senderId == req.user._id) {
        otherUserId = conversation.receiverId;
      } else {
        otherUserId = conversation.senderId;
      }

      let criteria = {
        conversationId: conversation._id,
      };

      let populateData = [
        {
          path: "senderId",
          select: "name image",
        },
        {
          path: "receiverId",
          select: "name image",
        },
      ];

      let data = await Chat.find(criteria, {}, options).populate(populateData);

      data = await userService.editConversationResponse(data, req.user._id);
      if (Object.entries(data).length !== 0) {
        chat.push(data);
      }
    }

    console.log("chat chat", chat);
  
    return res.send(
      successMessage(200, {
        userConversationsCount: chat.length ? chat.length : 0,
        chat,
      })
    );

  } else {
    return res.send(successMessage(200, { userConversationsCount: 0, chat }));
  }
});

module.exports = {
  startConversation,
  getChats,
};
