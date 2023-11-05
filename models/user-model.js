const mysql = require('../db/db.js');
const mailer = require('../utils/mailManager');
const auth = require('./auth-model.js');
const validator = require('validator');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const saltRounds = 10;

class User {
    async getAllUsers(res) {
        try {
            const sql = 'SELECT * FROM users';
            const [rows, fields] = await mysql.query(sql);
            res.json(this.userObj(rows));
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async getUserById(id, res) {
        try {
            const sql = 'SELECT * FROM users WHERE id=?';
            const [rows, fields] = await mysql.query(sql, id);
            if (rows.length === 0) {
                res.status(400).json('User not found');
            } else {
                res.json(this.userObj(rows)[0]);
            }
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async createNewUser(user, res) {
        try {
            let sqlUser = {
                login: user.login,
                password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(saltRounds)),
                name: user.name,
                rating: user.rating,
                email: user.email
            };

            const sql = 'INSERT INTO users SET ?';
            const [result, fields] = await mysql.query(sql, sqlUser);
            res.json("Success");
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async addAvatar(login, path, res) {
        try {
            const sql = `UPDATE users SET picture="${path}" WHERE login="${login}"`;
            const [result, fields] = await mysql.query(sql);
            res.json(path);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async getPostsByUser(id, res) {
        try {
            const sql = 'SELECT * FROM posts WHERE owner_id=?';
            const [rows, fields] = await mysql.query(sql, id);
            res.json(rows);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }
    
    async changeUser(user, authUser, id, res) {
        try {
            const sql = `UPDATE users SET ? WHERE id="${id}"`;
    
            if (authUser.id != id) {
                res.status(400).json('Not available');
                return;
            }
    
            if (user.role) {
                res.status(400).json('Not available');
                return;
            }

            if (user.login) {
                if (!(await auth.checkUnique('users', 'login', user.login))) {
                    res.status(400).json('Login already exists');
                    return;
                }
            }

            if (user.email) {
                if (!validator.isEmail(user.email)) {
                  return res.status(400).json('Invalid E-mail');
                }

                if (!(await auth.checkUnique('users', 'email', user.email))) {
                    res.status(400).json('Email already exists');
                    return;
                } else {
                    const activationLink = uuid.v4();
                    await mailer.sendActivationMail(user.email, `http://localhost:3001/api/auth/activate/${activationLink}/${id}`);
                    user.isActivated = false;
                }
            }
    
            const [result, fields] = await mysql.query(sql, user);

            const newUserData = await this.getUser(authUser.id);

            const tokens = auth.generateAndSaveTokens(newUserData.login, newUserData.picture, newUserData.email, newUserData.id, newUserData.role);
            auth.setTokens(res, tokens, newUserData.login, newUserData.email, newUserData.id, newUserData.role);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }
    

    async deleteUser(id, res) {
        try {
            const sql = `DELETE FROM users WHERE id="${id}"`;
            const [result, fields] = await mysql.query(sql);
            if (result.affectedRows === 0) {
                res.status(200).json('User already deleted');
            } else {
                res.json('Success');
            }
        } catch (err) {
            res.status(200).json(err);
        }
    }

    async getUser(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id=?';
            const [rows, fields] = await mysql.query(sql, id);
            if (rows.length === 0) {
                console.error('Error getting user');
            } else {
                return this.userObj(rows)[0];
            }
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    userObj(rows) {
        let userArr = [];

        rows.forEach((element, i) => {
            userArr[i] = {
                id: element.id,
                login: element.login,
                name: element.name,
                email: element.email,
                role: element.role,
                picture: element.picture,
                rating: element.rating
            };
        });

        return userArr;
    }
}

module.exports = new User();