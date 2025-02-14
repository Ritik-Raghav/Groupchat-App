require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const sequelize = require('./util/database');
const User = require('./models/user');
const Chat = require('./models/chat');
const Usergroup = require('./models/usergroup');
const Group = require('./models/group');
const auth = require('./middleware/auth');

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('uploads'));

app.use('/signup/', signupRoutes);
app.use('/login/', loginRoutes);
app.use('/chat', chatRoutes);
app.use('/group', groupRoutes);

// Database Relationships
User.hasMany(Chat);
Chat.belongsTo(User);
User.belongsToMany(Group, { through: Usergroup, unique: false });
Group.belongsToMany(User, { through: Usergroup, unique: false });
Group.hasMany(Chat);
Chat.belongsTo(Group);
Group.hasOne(Usergroup);
User.hasOne(Usergroup);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// File Upload Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const fileExtension = path.extname(file.originalname);
        const fileName = uniqueSuffix + '-' + file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// File Upload Route
app.post('/chat/file', auth.authenticate, upload.single('file'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      const user = req.user;
      const groupId = req.headers['group-id'];

    //   if (!groupId) {
    //       return res.status(400).json({ error: "Missing group ID" });
    //   }

      const fileUrl = `/uploads/${req.file.filename}`;

      // Save the chat message with the file link
      const chat = await user.createChat({
            chat: `<a href="${fileUrl}" target="_blank">📎 Download File</a>`,
            groupId: groupId
      });

      res.status(201).json({
          message: "File uploaded successfully",
          fileUrl,
          chat
      });

  } catch (err) {
      console.error("File upload error:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


sequelize.sync()
    .then(() => {
        app.listen(3000, () => console.log("Server running on port 3000"));
    })
    .catch(error => console.log(error));
