const express = require("express");
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,  { 
  cors: {    
    origin: "*",    
    methods: ["GET", "POST"]  
  }});
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const {generateAccessToken , authenticateToken} = require('./jwt/helpers')
const dotenv = require('dotenv');
dotenv.config();



const mongoose = require("mongoose")
const messagesService = require("./services/messages.service");
const userService = require("./services/users.service");

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

let connectionCount = 0;
let connectedUsers = 0;

// Middlewares
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: '*' }));
// Templating engine setup

//app.set("view engine", "ejs");

// Enpoints
app.get('/users', async (req,res)=>{
  const users = await userService.getUsers() 
  res.json(users);
})

app.get("/messages", authenticateToken,async (req, res) => {
  const messages = await messagesService.getMessagesHistory()
  if(messages.error){
    res.status(500).json(messages)
  }
  res.status(200).json(messages);
});

/**
 * implement data on mongo
 */
app.post('/user', async (req,res)=>{
  const user = await userService.createUser(req.body)
  if(user.message){
    return  res.status(500).json(user)
  }
  res.status(200).json(user)
})

app.delete("/messages", (req, res) => {
  messagesService.clearMessages();
  io.emit("clearMessages");
  res.status(200).send();
});


app.post('/message',authenticateToken,(req,res)=>{
  console.log(req.body)
  messagesService.addToMessageHistory(req.body.username,req.body.message)
  res.status(200).json({message:null,data:req.body})
})

app.post('/login', async (req,res)=>{
  const user = await userService.login(req.body)
  if(user.message){
    return res.status(500).json(error)
  }
  const token = generateAccessToken({ username: user });
  console.log("tken",token,user)
  res.status(200).json({user,token})
})



/**
 * implement data on mongo
 */
io.on("connection", (socket) => {
  connectionCount += 1;
  connectedUsers += 1;

  socket.on("chatMessageEmitted", ( {username, message} ) => {
    messagesService.addToMessageHistory( username, message );
    socket.broadcast.emit("chatMessageEmitted", { username, message });
  });
});

// Connect to MongoDB database
mongoose
	.connect("mongodb://localhost:27017/dmongo", { useNewUrlParser: true })
	.then(() => {

// Starting server.
		server.listen(3001, () => {
			console.log("Server has started!")
		})
	}).catch((e)=>{
    console.log("error connecting to db", e)
  })


