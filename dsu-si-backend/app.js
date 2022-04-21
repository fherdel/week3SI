const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
// JSWT
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const mongoose = require("mongoose");
const {
  getMessagesHistory,
  addToMessageHistory,
  clearMessages,
} = require("./services/messages.service");
const {
  getUsers,
  createUser,
  loginUser,
  clearUsers,
} = require("./services/users.service");
const {
  generateAccessToken,
  authenticateToken,
} = require("./services/auth.service");

let connectionCount = 0;
let connectedUsers = 0;

// Middlewares
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enpoints - User
app.get("/users", async (req, res) => {
  // Get users
  const users = await getUsers();
  res.json(users);
});

app.post("/users", async (req, res) => {
  //Create new user
  const token = generateAccessToken({ username: req.body.username });
  const user = await createUser(req.body);
  res.json({ ...user, token });
});

app.delete("/users", (req, res) => {
  // delete users
  const users = clearUsers();
  res.status(200).send(users);
});

app.post("/login", async (req, res) => {
  // Login
  const token = generateAccessToken({ username: req.body.username });
  const user = await loginUser(req.body);
  console.log(user);
  res.json({ ...user, token });
});

// Enpoints - Message
app.get("/messages", authenticateToken, async (req, res) => {
  //Get all messages
  const messages = await getMessagesHistory();
  res.json(messages);
});

app.post("/messages", authenticateToken, (req, res) => {
  // Create new message
  const messages = addToMessageHistory(req.body);
  res.json(messages);
});

app.delete("/messages", authenticateToken, (req, res) => {
  // Delete all messages
  const messages = clearMessages();
  io.emit("clearMessages");
  res.status(200).send(messages);
});

/**
 * implement data on mongo
 */
io.on("connection", (socket) => {
  connectionCount += 1;
  connectedUsers += 1;

  socket.on("chatMessageEmitted", ({ username, message }) => {
    addToMessageHistory(username, message);
    socket.broadcast.emit("chatMessageEmitted", { username, message });
  });
});

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/admin", { useNewUrlParser: true })
  .then(() => {
    // Starting server.
    server.listen(3001, () => {
      console.log("Server has started!");
    });
  })
  .catch((e) => {
    console.log("error connecting to db", e);
  });

// docker run -d -p 27017:27017 --name dbmongo mongo
