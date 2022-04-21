const express = require("express");
const cors = require('cors');
const app = express();
const server = require("http").createServer(app);
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
const { getUsers } = require("./services/users.service");

let connectionCount = 0;
let connectedUsers = 0;

// Middlewares
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: '*' }));
// Templating engine setup

//app.set("view engine", "ejs");

// Enpoints
app.get('/users', async (req,res)=>{
  const users = await getUsers()
  res.json(users);
})

app.get("/messages", async (req, res) => {
  const messages = await messagesService.getMessagesHistory()
  if(messages.error){
    res.status(500).json(messages)
  }
  res.status(200).json(messages);
});

/**
 * implement data on mongo
 */
app.post('/users', async (req,res)=>{
  
})

app.delete("/messages", (req, res) => {
  messagesService.clearMessages();
  io.emit("clearMessages");
  res.status(200).send();
});

app.post('/login', (req,res)=>{
  res.status(200).send("not implemented yet :'c")
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


