const User = require('../models/user');
const Group = require('../models/group');
const Usergroup = require('../models/usergroup');
const Chat = require('../models/chat');
const { Op } = require('sequelize');


exports.deleteGroup = async (req, res, next) => {
    try {
        const { groupId } = req.body;
        console.log(groupId)
        if (!groupId) {
            return res.status(400).json({ error: 'groupId is required'});
        }

        const deletedUsergroup = await Usergroup.destroy({
            where: { groupId }
        });

        const deletedGroup = await Group.destroy({
            where: { id: groupId }
        });

        if (deletedGroup === 0) {
            return res.status(404).json({ message: 'No matching record found'});

        }
        res.json({ message: 'Record deleted successfully' });
    }
    catch(error) {
        console.log(error);
    }
}

exports.deleteMember = async (req, res, next) => {
    try {
        const { groupId, userId} = req.body;

        if (!groupId || !userId) {
            return res.status(400).json({ error: 'groupId and userId is required'});
        }

        const result = await Usergroup.destroy({
            where: { groupId, userId }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'No matching record found'});

        }
        res.json({ message: 'Record deleted successfully' });
    }
    catch(error) {
        console.log(error);
    }
}

exports.postMember = async (req, res, next) => {
    try {
        const { memberName, groupId } = req.body;

        // Find user by username
        const user = await User.findOne({
            where: { username: memberName }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create Usergroup entry
        const newUsergroup = await Usergroup.create({
            userId: user.id,
            groupId: groupId
        });

        // Fetch user data again to include username in response
        const userData = await User.findOne({
            where: { id: user.id },
            attributes: ['id', 'username']
        });

        res.status(201).json({ usergroup: newUsergroup, user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.postGroup = async (req, res, next) => {
    try {
        const { groupName } = req.body;
        const user = req.user;
        const newGroup = await Group.create({
            name: groupName,
            creator: user.username
        });
        const groupId = newGroup.id;
        await Usergroup.create({
            isadmin: true,
            userId: user.id,
            groupId: groupId
        });
        res.status(201).json(newGroup);
    }
    catch(error) {
        console.log(error);
    }
}

exports.getUserGroups = async (req, res, next) => {
    try {
        const user = req.user;

        // Fetch user groups in one query
        const groupByUser = await Usergroup.findAll({
            where: { userId: user.id },
            attributes: ['groupId']
        });

        // Extract group IDs
        const groupIds = groupByUser.map(group => group.groupId);

        // Fetch all groups in a single query
        const groups = await Group.findAll({
            where: { id: groupIds }
        });

        res.status(200).json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.getGroupById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`id <<<< ${id}`);
        const group = await Group.findOne({
            where: {
                id: id
            }
        });
        const groupByUser = await Usergroup.findAll({
            where: { groupId: id },
            attributes: ['userId']
        });

        const userIds = groupByUser.map(group => group.userId);

        const users = await User.findAll({
            where: { id: userIds },
            include: [
                {
                    model: Usergroup,
                    attributes: ['isadmin'],
                    where: {
                        groupId: id
                    }
                }
            ]
        });

        res.status(201).json({ group: group, users: users});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.postGroupChat = async (req, res, next) => {
    try {
        const currentUser = req.user;
        const { chat, groupId } = req.body;
        console.log('chat <<<<<<<<<<<<' + chat);
        const newChat = await currentUser.createChat({ chat: chat, groupId: groupId});
        res.status(200).json({'userId': currentUser.id, 'username': currentUser.username, 'chat': chat, 'dateTime': newChat.createdAt, 'groupId': groupId});
    }
    catch(error) {
        console.log(error);
        res.status(202).json({ message: 'Error occurred'});
    }
}

exports.getGroupChats = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log('currentGroupId <<<<<<<<<<<<<' + id);
        const chats = await Chat.findAll({
            where: {
                groupId: id
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username'],
                },
            ],
            order: [['createdAt', 'ASC']],
        });

        // Formatting the response
        const formattedChats = chats.map(chat => ({
            id: chat.id,
            userId: chat.userId,
            groupId: chat.groupId,
            chat: chat.chat,
            dateTime: chat.createdAt,
            username: chat.user.username
        }));
        console.log(formattedChats);
        
        res.json({formattedChats});
    }
    catch(error) {
        console.log(error);
    }
}

exports.updateAdmin = async (req, res, next) => {
    try {
        const { admin, obj } = req.body;
        console.log('adminID <<<<<<<<' + admin);
        console.log('obj<<<<<' + obj.usergroup.groupId);
        console.log('useID<<<<<' + obj.usergroup.userId);

        const isadmin = admin === 1 ? true : false;
        console.log('isAdmin<<<<<<' + isadmin);

        // Correct update format
        const [affectedRows] = await Usergroup.update(
            { isadmin },  // Fix: Wrap inside an object
            {
                where: {
                    groupId: obj.usergroup.groupId,
                    userId: obj.usergroup.userId
                }
            }
        );

        if (affectedRows > 0) {
            res.status(200).json({ message: 'isadmin successfully updated' });
        } else {
            res.status(404).json({ message: 'Usergroup not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating isadmin:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

