const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,  { 
  cors: {    
    origin: "*",    
    methods: ["GET", "POST"]  
  }});
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use(express.json());
const mongoose = require("mongoose")
const messagesService = require("./services/messages.service");
const { getUsers, createUser, logIn } = require("./services/users.service");
let connectionCount = 0;
let connectedUsers = 0;

// Middlewares
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: '*' }));
// Templating engine setup

app.set("view engine", "ejs");

// Enpoints
app.get('/users', async (req,res)=>{
  const users = await getUsers()
  res.json(users);
})

app.get("/messages/", async(req, res) => {
  try {
    const messages= await messagesService.getMessagesHistory()
    res.status(200).send(messages);
  } catch (error) {
    console.log(error)
  }
});

/**
 * implement data on mongo
 */
app.post('/signin', async (req,res)=>{
  try {
    const user =  req.body.username;
    const password = req.body.password;
    const newUser = await createUser(user, password);
    console.log(newUser.username)
    res.status(200).send({
      message: "new user created",
      User:{
        token: newUser.token,
        username: newUser.username,
      }
    })
  } catch (error) {
    res.status(400).send({message: error})
  }
})

app.post('/message', async (req,res)=>{
  try {
    const token =  req.body.token;
    const message = req.body.message;
    const newMessage = await messagesService.addToMessageHistory( token, message );
    console.log('ll')
    console.log(newMessage)
    res.status(200).send({
      message: "new user created",
      newMessage
    })
  } catch (error) {
    res.status(400).send({message: error})
  }
})

app.delete("/messages", (req, res) => {
  try {
    const token = req.body.token
    messagesService.clearMessages(token);
    io.emit("clearMessages");
    res.status(200).send({
      message: "all messages were deleted"
    });
  } catch (error) {
    res.status(400).send({
      message: error
    })
  }
});

app.post('/login', async(req,res)=>{
  try {
    const newUser = req.body.username;
    const password = req.body.password;
    const user = await logIn(newUser, password)
    console.log(user)
    res.status(200).send({
      message: "log in Successfully",
      token: user.verifyUser.token,
      username: user.verifyUser.username
    })
    
  } catch (error) {
    res.status(400).send({message: error})
  }
})

/**
 * implement data on mongo
 */
io.on("connection", (socket) => {
  connectionCount += 1;
  connectedUsers += 1;

  socket.on("chatMessageEmitted", async( {username, message} ) => {
    await messagesService.addToMessageHistory( username, message );
    socket.broadcast.emit("chatMessageEmitted", { username, message });
  });
});
const mongoRoute = process.env.MONGO
// Connect to MongoDB database
mongoose
	.connect(mongoRoute, { useNewUrlParser: true })
	.then(() => {

// Starting server.
		server.listen(3001, () => {
			console.log("Server has started!")
		})
	}).catch((e)=>{
    console.log("error connecting to db", e)
  })


