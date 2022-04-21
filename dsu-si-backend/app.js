const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: [ 'GET', 'POST' ]
	}
});
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const mongoose = require('mongoose');
const messagesService = require('./services/messages.service');
const { getUsers, createUser, getSingleUser } = require('./services/users.service');
const { readSync } = require('fs');

let connectionCount = 0;
let connectedUsers = 0;

// Middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Templating engine setup

app.set('view engine', 'ejs');

// Enpoints
app.get('/users', async (req, res) => {
	const users = await getUsers();
	res.json(users);
});

app.get('/messages', async (req, res) => {
	const messages = await messagesService.getMessagesHistory();
	res.json(messages);
});

/**
 * implement data on mongo
 */
app.post('/users', async (req, res) => {
	const { username, password } = req.body;
	const pre = await createUser(username, password);
	res.status(200).send(pre);
});

app.delete('/messages', (req, res) => {
	messagesService.clearMessages();
	io.emit('clearMessages');
	res.status(200).send();
});

app.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const tempo = await getSingleUser(username, password);
	if (tempo !== null) {
		res.status(200).send({ user: tempo.username });
	} else {
		res.status(404).send({ user: null });
	}
});

/**
 * implement data on mongo
 */
io.on('connection', (socket) => {
	connectionCount += 1;
	connectedUsers += 1;

	socket.on('chatMessageEmitted', ({ username, message }) => {
		messagesService.addToMessageHistory(username, message);
		socket.broadcast.emit('chatMessageEmitted', { username, message });
	});
});

// Connect to MongoDB database
mongoose
	.connect('mongodb://localhost:27017/admin', { useNewUrlParser: true })
	.then(() => {
		// Starting server.
		server.listen(3001, () => {
			console.log('Server has started!');
		});
	})
	.catch((e) => {
		console.log('error connecting to db', e);
	});
