const express = require("express");
const user = require("./user.routes");
const Chat=require("./user.chat");


const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: user,
  },
  {
    path:"/chat",
    route:Chat
  }
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
