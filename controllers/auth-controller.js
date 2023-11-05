
const {validationResult} = require('express-validator');
const auth = require('../models/auth-model');

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            } else {
                await auth.register(req.body, res);
            }
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async login(req, res) {
        try {
            await auth.login(req.body, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            await auth.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.status(200).json('logout');
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async activate(req, res) {
        try {
            await auth.activate(req.params.id, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async resetSendLink(req, res) {
        try {
            await auth.resetPasswordSendLink(req.body.email, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async resetPasswordWithToken(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            } else {
                await auth.resetPassword(req.body, res);
            }
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;
            await auth.refresh(refreshToken, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }
}

module.exports = new AuthController();