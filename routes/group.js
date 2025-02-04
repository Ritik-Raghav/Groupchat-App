const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const userAuthentication = require('../middleware/auth');


// router.get('/getMembers', userAuthentication.authenticate, groupController.getMembers);
router.post('/postMember', userAuthentication.authenticate, groupController.postMember);
router.post('/postGroup', userAuthentication.authenticate, groupController.postGroup);
router.get('/getUserGroups', userAuthentication.authenticate, groupController.getUserGroups);
router.get('/getGroupById/:id', userAuthentication.authenticate, groupController.getGroupById);
router.delete('/deleteMember', groupController.deleteMember);
router.delete('/deleteGroup', groupController.deleteGroup);
router.post('/postGroupChat', userAuthentication.authenticate, groupController.postGroupChat);



module.exports = router;