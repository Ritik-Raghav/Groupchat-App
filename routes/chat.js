const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const userAuthentication = require('../middleware/auth');


router.post('/postChat', userAuthentication.authenticate, chatController.postChat);
// router.get('/getChat', userAuthentication.authenticate, chatController.getChat);



module.exports = router;