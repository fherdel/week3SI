const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const server = require("http").createServer(app);
const dotenv = require('dotenv');
const { Server } = require("socket.io");
const io = new Server(server,  { 
  cors: {    
    origin: "*",    
    methods: ["GET", "POST"]  
  }});
dotenv.config();
process.env.TOKEN_SECRET;
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

app.get("/messages",authenticateToken, async (req, res) => {
  const messages= await messagesService.getMessagesHistory()
  res.json(messages);
});

/**
 * implement data on mongo
 */
//endpoint para la creacion del nuevo usuario
app.post('/users', async (req,res)=>{  
  const newusers = await createUser(req.body)
  const token= {token: generateAccessToken({ username: req.body.username })}
  res.json( {
    ...newusers, 
    ...token
  });
})

app.delete("/messages", authenticateToken, async (req, res) => {
  console.log('eliminar todo llegue ')
  messagesService.clearMessages();
  io.emit("clearMessages"); 
  res.status(200).send({message:"all deleted"});
});

//endpoint para realizar el login, devuelve username false si este no se llevo acabo correctamente
app.post('/login', async (req,res)=>{
  const status = await loginTry(req.body)
  if (status.username===false) {
    res.json(status);  
  } else {
    const token= {token: generateAccessToken({ username: req.body.username })}
    res.json( {
      ...status, 
      ...token
    });
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
	.connect(process.env.URLMONGO, { useNewUrlParser: true })
	.then(() => {

// Starting server.
		server.listen(3001, () => {
			console.log("Server has started!")
		})
	}).catch((e)=>{
    console.log("error connecting to db", e)
  })


  function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }

  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, String(process.env.TOKEN_SECRET), (err, user) => {
      if (err!=null) {
        console.log(err)  
      }

      if (err) return res.sendStatus(403)
      
      next()
    })
  }