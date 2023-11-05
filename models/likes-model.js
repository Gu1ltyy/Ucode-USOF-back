const mysql = require('../db/db.js');

class Like {
    async getLikes(id, type, res) {
        try {
            const likeSql = `SELECT * FROM likes WHERE ${type}_id=? AND dislike=false`;
            const dislikeSql = `SELECT * FROM likes WHERE ${type}_id=? AND dislike=true`;
            const [likes] = await mysql.query(likeSql, id);
            const [dislikes] = await mysql.query(dislikeSql, id);
    
            const likeArr = likes.map(element => Object.assign(element, { count: likes.length }));
            const dislikeArr = dislikes.map(element => Object.assign(element, { count: dislikes.length }));
    
            res.json({ likes: likeArr, dislikes: dislikeArr });
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }
    
    async setLike(id, login, isDislike, type, res) {
        try {
            const checkLike = `SELECT * FROM likes WHERE login=? AND ${type}_id=?`;
            const [likeRows] = await mysql.query(checkLike, [login, id]);
    
            if (likeRows.length > 0) {
                res.status(400).json(`User already reacted to the ${type}`);
                return;
            }
    
            const sql = `INSERT INTO likes (login, ${type}_id, dislike) VALUES (?, ?, ?)`;
            await mysql.query(sql, [login, id, isDislike]);
    
            const [rows] = await mysql.query(`UPDATE ${type}s SET rating = rating ${isDislike ? '-' : '+'} 1 WHERE id="${id}"`);
            if (rows.affectedRows === 0) {
                res.status(200).json(`${type.charAt(0).toUpperCase() + type.slice(1)} already deleted`);
                return;
            }
    
            const [ownerRows] = await mysql.query(`SELECT * FROM ${type}s WHERE id=?`, id);
            await mysql.query(`UPDATE users SET rating = rating ${isDislike ? '-' : '+'} 1 WHERE login="${ownerRows[0].owner}"`);
            res.json('Success');
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async deleteLike(id, login, type, res) {
        try {
            const checkLike = `SELECT * FROM likes WHERE login=? AND ${type}_id=?`;
            const [likeRows] = await mysql.query(checkLike, [login, id]);
    
            if (likeRows.length === 0) {
                res.status(400).json(`User does not like the ${type}`);
                return;
            }
    
            const isDislike = likeRows[0].dislike;
            const sql = `UPDATE ${type}s SET rating = rating ${isDislike ? '+' : '-'} 1 WHERE id="${id}"`;
            const [result] = await mysql.query(sql);
    
            if (result.affectedRows === 0) {
                res.status(200).json(`${type.charAt(0).toUpperCase() + type.slice(1)} already deleted`);
                return;
            }
    
            await mysql.query(`DELETE FROM likes WHERE ${type}_id="${id}" AND login="${login}"`);
    
            const [rows] = await mysql.query(`SELECT * FROM ${type}s WHERE id=?`, id);
            await mysql.query(`UPDATE users SET rating = rating ${isDislike ? '+' : '-'} 1 WHERE login="${rows[0].owner}"`);
            res.json('Success');
        } catch (err) {
            res.status(400).json('Internal Server Error' + err);
        }
    }
    
}

module.exports = new Like();