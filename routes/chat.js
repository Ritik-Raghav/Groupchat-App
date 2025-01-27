const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const userAuthentication = require('../middleware/auth');


router.post('/postChat', userAuthentication.authenticate, chatController.postChat);
router.get('/getChats', userAuthentication.authenticate, chatController.getChats);
router.get('/getChats/:id', userAuthentication.authenticate, chatController.getChatsById);



module.exports = router;