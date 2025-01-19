const User = require('../models/user');
const Chat = require('../models/chat');
const { Op } = require('sequelize');



exports.postChat = async (req, res, next) => {
    try {
        const currentUser = req.user;
        const { chat, dateTime} = req.body;
        console.log(chat);
        const newChat = await currentUser.createChat({ chat: chat});
        res.status(200).json({'userId': currentUser.id, 'user': currentUser.username, 'chat': chat, 'dateTime': dateTime});
    }
    catch(error) {
        console.log(error);
        res.status(202).json({ message: 'Error occurred'});
    }
}

// exports.getChat = async (req, res, next) => {
//     try {
//         const currentUser = req.user;
//         const chats = await Chat.findAll();
//         const logs = [];
//         for (const i in chats) {
//             if (chats[i].userId === currentUser.id) {
//                 logs.push(`You : ${chats[i].chat}`)
//             }
//             else {
//                 const name = await User.findOne({ where: {id: chats[i].userId }});
//                 logs.push(`${name.name} : ${chats[i].chat}`);
//             }
//         }
//         console.log(logs);
//         res.status(200).json({ logs: logs});
//     }
//     catch(error) {
//         console.log(error);
//         res.status(202).json({ message : 'Error in getChats'});
//     }
// }