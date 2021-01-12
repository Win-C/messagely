'use strict';

const Router = require('express').Router;
const router = new Router();
const { ensureLoggedIn } = require('../middleware/auth.js');
const Message = require('../models/message.js');
const { UnauthorizedError } = require('../expressError');

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id/', ensureLoggedIn, async function(req, res, next) {
	const message = await Message.get(req.params.id);
	const from_username = res.locals.user.username;

	if (message.from_user.username !== from_username && message.to_user.username !== from_username) {
		throw new UnauthorizedError(`You are not authorized to view the message!`);
	}

	return res.send({ message });
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async function(req, res, next) {
	const { to_username, body } = req.body;
	const from_username = res.locals.user.username;
	const message = Message.create({ from_username, to_username, body });

	return res.json({ message });
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureLoggedIn, async function(req, res, next) {
	const { id } = req.params.id;
	const currentUser = res.locals.user.username;
	const message = Message.get(id);

	Message.markRead({ id });

	if (currentUser !== message.to_user.username) {
		throw new UnauthorizedError(`You are not authorized to read the message!`);
	}

	return res.json({
		message: {
			id: message.id,
			read_at: message.read_at
		}
	});
});

module.exports = router;
