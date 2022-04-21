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
const { getMessagesHistory, addToMessageHistory, clearMessages} = require("./services/messages.service");
const { getUsers, login, createUser } = require("./services/users.service");
const { response } = require("express");

let connectionCount = 0;
let connectedUsers = 0;

// Middlewares
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
// Templating engine setup

app.set("view engine", "ejs");

// Enpoints
app.get('/users', async (req,res)=>{
  const users = await getUsers();
  res.json(users);
})

/**
 * implement data on mongo
 */
app.post('/users', async (req,res)=>{
  try {
    const user = await createUser(req.body);
    res.status(200).send(user);
  } catch(error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/login', async (request,response)=>{
  try {
    const user = await login(request.body);
    response.status(200).send(user);
  } catch(error) {
    console.log(error);
    response.status(500).send(error);
  }
})

app.get("/messages", async (req, res) => {
  try {
    const messages = await getMessagesHistory(res);
    console.log(messages);
    response.json(messages);
  } catch(error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.post('/messages', async (request, response) => {
  try {
    const message = await addToMessageHistory(request.body, response);
    response.status(200).send(message);
  } catch(error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.delete("/messages", async (req, res) => {
  try {
    const message = await clearMessages(res);
    io.emit("clearMessages");
    res.status(200).send(message);
  } catch(error) {
    console.log(error);
    response.status(500).send(error);
  }
});

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
	.connect("mongodb://localhost:27017/admin", { useNewUrlParser: true })
	.then(() => {

// Starting server.
		server.listen(3001, () => {
			console.log("Server has started!")
		})
	}).catch((e)=>{
    console.log("error connecting to db", e)
  })


