const express = require("express");
const cors = require('cors');
const app = express();
var morgan = require('morgan');
const jwt = require('jsonwebtoken');
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
/**JWT */
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

app.post('/api/createNewUser', (req, res) => {
  // ...

  const token = generateAccessToken({ username: req.body.username });
  res.json(token);

  // ...
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

app.get('/api/userOrders', authenticateToken, (req, res) => {
  // executes after authenticateToken
  res.json({authorized: true})
  // ...
})

// Enpoints
app.get('/users', async (req,res)=>{
  const users = await getUsers()
  res.json(users);
})

app.get("/messages", authenticateToken, async (req, res) => {
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

app.delete("/messages",authenticateToken ,(req, res) => {
  messagesService.clearMessages();
  io.emit("clearMessages");
  res.status(200).send();
});

app.post('/login', async (req,res)=>{
  const {username,password} = req.body;
  const newUser = await getUser(username,password);
  const token = generateAccessToken({ username: req.body.username });
  const userData = {...newUser[0]._doc,token} 
  if (newUser.length === 1) {
    res.status(200).json({data: userData, error:false, msj:"user found"})
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
	.connect(`mongodb://${credentials.mongo.host}:27017/admin`, { useNewUrlParser: true })
	.then(() => {

// Starting server.
		server.listen(3001, () => {
			console.log("Server has started!")
		})
	}).catch((e)=>{
    console.log("error connecting to db", e)
  })


