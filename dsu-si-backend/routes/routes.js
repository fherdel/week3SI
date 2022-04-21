const express = require('express')
const router = express.Router()
const MessageController = require('../controller/MessageController')


/* Create Message */
router.post('/message',MessageController.createMessage)

// Get Messages
router.get('/messages',MessageController.getMessages)

// Delete Messages
router.delete('message',MessageController.deteleMessages)

module.exports = router