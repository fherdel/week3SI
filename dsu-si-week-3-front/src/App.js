import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { login, logout, createUser } from './store/user.reducer';

import { getMessages, addMessage } from './store/messages.reducer';
import socketIOClient from 'socket.io-client';
import Messages from './components/Messages';
import ChatBar from './components/ChatBar';

const ENDPOINT = `http://${process.env.REACT_APP_IP_POINT}:3001`;
let socket;
function App() {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	useEffect(() => {
		dispatch(getMessages());
		socket = socketIOClient(ENDPOINT);
		console.log('socket: ', socket);

		socket.on('chatMessageEmitted', ({ username, message }) => {
			dispatch(addMessage(username, message));
		});

		socket.on('clearMessages', (x) => {
			console.log('clear messages: ', x);
		});
	}, []);

	const emitMessage = (username, message) => {
		socket.emit('chatMessageEmitted', {
			username,
			message
		});
		dispatch(addMessage('My self', message));
	};

	/**
	 * add logic to create users
	 */
	const handleSingIn = async (values, setSubmitting) => {
		console.log('handleSingIn');
		setSubmitting(true);
		dispatch(createUser(values));
		setSubmitting(false);
	};

	if (user) {
		return (
			<div>
				{user.username}
				<button onClick={() => dispatch(logout())}>Logout</button>
				<Messages />
				<ChatBar emitMessage={emitMessage} />
			</div>
		);
	}
	// socket events

	return (
		<div>
			<div style={{ margin: '20px' }}>
				<Formik
					initialValues={{ username: '', password: '' }}
					onSubmit={async (values, { setSubmitting }) => {
						console.log('submiting');
						setSubmitting(true);
						await dispatch(login(values));
						setSubmitting(false);
					}}
					validate={(values) => {
						const errors = {};
						if (!values.username) {
							errors.username = 'Required';
						} else if (!values.password) {
							errors.password = 'Required';
						}
						return errors;
					}}
				>
					{({ isSubmitting, values, setSubmitting }) => (
						<Form>
							<Field type="text" name="username" />
							<Field type="password" name="password" />
							<button type="submit" disabled={isSubmitting}>
								Login
							</button>
							<button onClick={() => handleSingIn(values, setSubmitting)} disabled={isSubmitting}>
								Sing in
							</button>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default App;
