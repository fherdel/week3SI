const express = require("express");
const cors = require('cors');
const app = express();
var morgan = require('morgan');
const server = require("http").createServer(app);
const credentials = require('./config/config');
const { Server } = require("socket.io");
const io = new Server(server,  { 
  cors: {    
    origin: "*",    
    methods: ["GET", "POST"]  
  }});
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const mongoose = require("mongoose")
const messagesService = require("./services/messages.service");
const { getUsers,createUser,getUser } = require("./services/users.service");

let connectionCount = 0;
let connectedUsers = 0;

// Middlewares
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
// Templating engine setup

app.set("view engine", "ejs");

// Enpoints
app.get('/users', async (req,res)=>{
  const users = await getUsers()
  res.json(users);
})

app.get("/messages", async (req, res) => {
  const messages = await messagesService.getMessagesHistory()
  res.json(messages);
});

/**
 * implement data on mongo
 */
app.post('/users', async (req,res)=>{
  console.log(">>>>>>>>>> post user")
  const {username,password} = req.body;
  const newUser = await createUser(username,password);
  res.status(200).json({newUser})
})

app.delete("/messages", (req, res) => {
  messagesService.clearMessages();
  io.emit("clearMessages");
  res.status(200).send();
});

app.post('/login', async (req,res)=>{
  const {username,password} = req.body;
  const newUser = await getUser(username,password);
  if (newUser.length === 1) {
    res.status(200).json({data: newUser[0], error:false, msj:"user found"})
  } else {
    res.status(404).json({data: {}, error:true, msj:"user not found"})
  }
})



/**
 * implement data on mongo
 */
io.on("connection", (socket) => {
  connectionCount += 1;
  connectedUsers += 1;

  socket.on("chatMessageEmitted", async ( {username, message} ) => {
    const delta = await messagesService.addToMessageHistory( username, message );
    console.log(delta)
    socket.broadcast.emit("chatMessageEmitted", { username, message });
  });
});

// Connect to MongoDB database
mongoose
	.connect(credentials.mongo.uri, { useNewUrlParser: true })
	.then(() => {

// Starting server.
		server.listen(3001, () => {
			console.log("Server has started!")
		})
	}).catch((e)=>{
    console.log("error connecting to db", e)
  })


