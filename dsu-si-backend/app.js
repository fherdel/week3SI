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
const { getUsers, createUser, loginTry } = require("./services/users.service");  //metodos...............................
var bodyParser = require('body-parser');
let connectionCount = 0;
let connectedUsers = 0;
app.use(bodyParser.json());
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

app.get("/messages", async (req, res) => {
  const messages= await messagesService.getMessagesHistory()
  res.json(messages);
});

/**
 * implement data on mongo
 */
//endpoint para la creacion del neuvo usuario
app.post('/users', async (req,res)=>{
  const newusers = await createUser(req.body)
  res.json(newusers);
})
app.delete("/messages", async (req, res) => {
  console.log('eliminar todo llegue ')
  messagesService.clearMessages();
  io.emit("clearMessages"); 
  res.status(200).send({message:"all deleted"});
});
//endpoint para realizar el login, devuelve username false si este no se llevo acabo correctamente
app.post('/login', async (req,res)=>{
  const status = await loginTry(req.body)
  res.json(status);
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


