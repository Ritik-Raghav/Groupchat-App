const User = require('../models/user');
const Chat = require('../models/chat');
const { Op } = require('sequelize');



exports.postChat = async (req, res, next) => {
    try {
        const currentUser = req.user;
        const { chat, dateTime} = req.body;
        console.log(chat);
        const newChat = await currentUser.createChat({ chat: chat, dateTime: dateTime});
        res.status(200).json({'userId': currentUser.id, 'username': currentUser.username, 'chat': chat, 'dateTime': dateTime});
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

exports.getChatsById = async (req, res, next) => {
    try {
        let lastId = req.params.id;
        console.log('lastid ---- ' +  lastId);
        const chats = await Chat.findAll({
            where: {
                id: {
                    [Op.gt]: lastId,
                },
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username'],
                },
            ],
            order: [['dateTime', 'ASC']],
        });

        let change = true;
        // Formatting the response
        const formattedChats = chats.map(chat => ({
            id: chat.id,
            userId: chat.userId,
            chat: chat.chat,
            dateTime: chat.dateTime,
            username: chat.user.username
        }));
        console.log(formattedChats);
        
        if (chats.length == 0) {
            change = false;
        }
        res.json({formattedChats, change: change});
    }
    catch(error) {
        console.log(error);
    }
}
