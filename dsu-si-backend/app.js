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

app.get("/messages", (req, res) => {
  const messages=messagesService.getMessagesHistory()
  res.json(messages);
});

/**
 * implement data on mongo
 */
app.post('/users', async (req,res)=>{
  try {
    const user =  req.body.user;
    const password = req.body.password;
    const newUser = await createUser(user, password);
    console.log(newUser)
    res.status(200).send({
      message: "new user created",
      user
    })
  } catch (error) {
    res.status(400).send({message: error})
  }
})

app.delete("/messages", (req, res) => {
  messagesService.clearMessages();
  io.emit("clearMessages");
  res.status(200).send();
});

app.post('/login', async(req,res)=>{
  try {
    const newUser = req.body.user;
    const password = req.body.password;
    const user = await logIn(newUser, password)
    res.status(200).send({
      message: "log in Successfully",
      user
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


