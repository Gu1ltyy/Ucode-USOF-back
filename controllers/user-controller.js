const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid').v4;
const User = require('../models/user-model');
const types = ['image/png', 'image/jpg'];
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'avatars/')
    },
    filename(req, file, cb) {
        let filename = uuidv4() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type.'), false);
    }
  };

class UserController {
    async getAllUsers(req, res) {
        try {
            User.getAllUsers(res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async getUserById(req, res) {
        try {
            User.getUserById(req.params.userId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async createNewUser(req, res) {
        try {
            User.createNewUser(req.body, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async addAvatar(req, res) {
        const upload = multer({ storage: storage, fileFilter: fileFilter });

        upload.single('avatar')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                res.status(500).json('Internal Server Error');
            } else if (err) {
                res.status(500).json('Internal Server Error');
            } else {
                try {
                    await User.addAvatar(req.user.login, req.file.path, res);
                } catch (error) {
                    res.status(500).json('Internal Server Error');
                }
            }
        });
    }

    async getPostsByUser(req, res) {
        try {
            User.getPostsByUser(req.params.userId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async changeUser(req, res) {
        try {
            User.changeUser(req.body, req.user, req.params.userId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async deleteUser(req, res) {
        try {
            User.deleteUser(req.params.userId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }
}

module.exports = new UserController();