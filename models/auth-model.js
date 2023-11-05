const mysql = require('../db/db.js');
const bcrypt = require('bcrypt');
const tokenManager = require('../utils/tokenManager');
const mailer = require('../utils/mailManager');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const JWT_RESET_SECRET = 'reset-token';

class Auth {
    async register(user, res) {
        try {
            const isLoginUnique = await this.checkUnique('users', 'login', user.login);
            if (!isLoginUnique) {
                return res.status(400).json('Login already exists');
            }

            const isEmailUnique = await this.checkUnique('users', 'email', user.email);
            if (!isEmailUnique) {
                return res.status(400).json('Email already exists');
            }

            const hashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(saltRounds));
            const activationLink = uuid.v4();

            const sqlUser = {
                login: user.login,
                password: hashedPassword,
                name: user.name,
                email: user.email,
                picture: 'default.png',
                rating: 0,
            };

            const sqlInsert = 'INSERT INTO users SET ?';
            const insertion = await this.queryDatabase(sqlInsert, sqlUser);

            if (!insertion.success)
                return res.status(400).json(insertion.error);

            await mailer.sendActivationMail(user.email, `http://localhost:3001/api/auth/activate/${activationLink}/${insertion.result.insertId}`);

            const tokens = this.generateAndSaveTokens(user.login, user.picture, user.email, insertion.result.insertId, 'user');
            this.setTokens(res, tokens, user.login, user.email, insertion.result.insertId, 'user');
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async activate(id, res) {
        try {
            const sqlUpdate = `UPDATE users SET isActivated=true WHERE id="${id}"`;
            await this.queryDatabase(sqlUpdate);
            res.redirect('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Emoji_u1f44c.svg/512px-Emoji_u1f44c.svg.png'); //change to the success page 
        } catch (error) {
            res.status(400).json('Internal Server Error');
        }
    }

    async login(user, res) {
        try {
            const sqlSelect = 'SELECT * FROM users WHERE login=?';
            const rows = await this.queryDatabase(sqlSelect, user.login);

            if (!rows.result[0])
                return res.status(400).json('User is not found!');

            const isPasswordValid = bcrypt.compareSync(user.password, rows.result[0].password);

            if (isPasswordValid) {
                if (rows.result[0].isActivated === false) {
                    res.status(400).json('Please activate your account before logging in');
                }
                const tokens = this.generateAndSaveTokens(rows.result[0].login, rows.result[0].picture, rows.result[0].email, rows.result[0].id, rows.result[0].role);
                this.setTokens(res, tokens, rows.result[0].login, rows.result[0].email, rows.result[0].id, rows.result[0].role);
            } else {
                res.status(400).json('Incorrect password');
            }
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async resetPasswordSendLink(email, res) {
        try {
            const isEmailExist = await this.checkUnique('users', 'email', email);
            if (isEmailExist) {
                return res.status(400).json('E-mail was not found');
            }

            const resetToken = jwt.sign({ email }, JWT_RESET_SECRET, { expiresIn: '30m' });
            const resetLink = `http://localhost:3001/api/auth/password-reset/${resetToken}`;
            await mailer.sendPasswordResetLink(email, resetLink);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }    

    async resetPassword(params, res) {
        try {
            const decoded = jwt.verify(params.resetToken, JWT_RESET_SECRET);
    
            const newHashedPassword = bcrypt.hashSync(params.newPassword, bcrypt.genSaltSync(saltRounds));
            const sqlUpdate = `UPDATE users SET password="${newHashedPassword}" WHERE email="${decoded.email}"`;
    
            await this.queryDatabase(sqlUpdate);
        } catch (error) {
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                res.status(400).json('Invalid or expired reset token.');
            } else {
                res.status(500).json('Internal Server Error');
            }
        }
    }
    

    logout(refreshToken) {
        tokenManager.removeToken(refreshToken);
    }

    async refresh(refreshToken, res) {
        try {
            if (!refreshToken)
                return res.status(401).json('Unauthorized error');

            const userData = tokenManager.validateToken(refreshToken);
            if (!userData)
                return res.status(401).json('Unauthorized error');

            const sqlSelectTokens = 'SELECT * FROM tokens WHERE token=?';
            const rows = await this.queryDatabase(sqlSelectTokens, refreshToken);

            if (!rows.success)
                return res.status(401).json('Unauthorized error');

            const tokens = this.generateAndSaveTokens(userData.login, userData.picture, userData.email, userData.id, userData.role);
            this.setTokens(res, tokens, userData.login, userData.email, userData.id, userData.role);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    generateAndSaveTokens(login, picture, email, id, role) {
        const tokens = tokenManager.generateTokens({
            login: login,
            email: email,
            id: id,
            role: role,
            picture: picture
        });

        tokenManager.saveToken(id, tokens.refreshToken);

        return tokens;
    }

    setTokens(res, tokens, login, email, id, role) {
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 60 * 60 * 24 * 7 * 1000, httpOnly: true });

        res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            login: login,
            email: email,
            id: id,
            role: role,
        });
    }

    checkUnique(table, column, value) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ${table} WHERE ${column} = ?`;
            mysql.query(query, [value])
                .then(([results, fields]) => {
                    resolve(results.length === 0);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    queryDatabase(sql, params = null) {
        return new Promise((resolve, reject) => {
            const queryPromise = params ? mysql.query(sql, params) : mysql.query(sql);
    
            queryPromise
                .then(([result, rows]) => {
                    resolve({ success: true, result: result, rows: rows });
                })
                .catch((error) => {
                    console.error('Error executing query:', error);
                    resolve({ success: false, error: error });
                });
        });
    }
}

module.exports = new Auth();