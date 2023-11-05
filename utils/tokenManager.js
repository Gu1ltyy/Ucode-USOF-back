const jwt = require('jsonwebtoken');
const mysql = require('../db/db.js');

const JWT_ACCESS_SECRET = 'access-token';
const JWT_REFRESH_SECRET = 'refresh-token';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '4h' });
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken
        };
    }

    validateToken(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    saveToken(id, refreshToken) {
        const tokenData = {
            owner_id: id,
            token: refreshToken
        };
    
        const tokenSql = 'INSERT INTO tokens SET ?';
    
        mysql.query(tokenSql, tokenData)
            .then(([rows, fields]) => {
                console.log('Token saved successfully.');
            })
            .catch((error) => {
                console.error('Error saving token:', error);
            });
    }
    
    removeToken(refreshToken) {
        const sql = 'DELETE FROM tokens WHERE token = ?';
    
        mysql.query(sql, refreshToken)
            .then(([rows, fields]) => {
                console.log('Token removed successfully.');
            })
            .catch((error) => {
                console.error('Error removing token:', error);
            });
    }
}

module.exports = new TokenService();