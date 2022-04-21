module.exports = (routes) => {
  const controllers = require("../services/users.service");
const controllersMessage = require("../services/messages.service")
  var router = require("express").Router();
  // User
  // Create a new user
  router.post("/user", controllers.createUser);
  // get user
  router.get("/user", controllers.getUsers);
  // get user
  router.get("/login", controllers.Login);

  // Message
//get Messages
  router.get("/messages", controllersMessage.getMessagesHistory);
 //add Message
 router.post("/messages", controllersMessage.addToMessageHistory);
 //delete Messages
 router.delete("/messages", controllersMessage.clearMessages);
 
  routes.use("", router);
};
