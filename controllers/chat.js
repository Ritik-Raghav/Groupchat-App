const User = require('../models/user');
const Chat = require('../models/chat');
const { Op } = require('sequelize');



exports.postChat = async (req, res, next) => {
    try {
        const currentUser = req.user;
        const { chat, dateTime} = req.body;
        console.log(chat);
        const newChat = await currentUser.createChat({ chat: chat, dateTime: dateTime});
        res.status(200).json({'id': currentUser.id, 'username': currentUser.username, 'chat': chat, 'dateTime': dateTime});
    }
    catch(error) {
        console.log(error);
        res.status(202).json({ message: 'Error occurred'});
    }
}

exports.getChats = async (req, res, next) => {
    try {
        const chats = await Chat.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username'],
                },
            ],
            order: [['dateTime', 'ASC']], // order by time date
        });

        // Formatting the response
        const formattedChats = chats.map(chat => ({
            id: chat.userId,
            chat: chat.chat,
            dateTime: chat.dateTime,
            username: chat.user.username
        }));

        console.log(formattedChats)
        
        res.status(200).json(formattedChats);
    }
    catch(error) {
        console.log(error);
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