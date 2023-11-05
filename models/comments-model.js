const mysql = require('../db/db.js');

class Comment {
    async getAllComments(id, res) {
        try {
            const sql = 'SELECT * FROM comments WHERE post_id=?';
            const [rows] = await mysql.query(sql, id);
            res.json(rows);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async getCommentById(id, res) {
        try {
            const sql = 'SELECT * FROM comments WHERE id=?';
            const [rows] = await mysql.query(sql, id);
            if (rows.length === 0) {
                res.status(404).json('Comment not found');
                return;
            }

            res.json(rows[0]);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async createComment(id, owner_id, comment, owner, res) {
        try {
            let sqlComment = {
                owner: owner,
                owner_id: owner_id,
                post_id: id,
                content: comment.content,
                date: new Date().toJSON().slice(0, 19).replace('T', ' ')
            };
            
            const sql = 'INSERT INTO comments SET ?';
            
            await mysql.query(sql, sqlComment);
            res.json("Success");
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async changeComment(id, comment, roles, login, res) {
        try {
            const [rows] = await mysql.query(`SELECT * FROM comments WHERE id="${id}"`);
            if (rows.length === 0) {
                res.status(400).json('Comment not found');
                return;
            }

            if (login !== rows[0].owner && roles !== 'admin') {
                res.status(400).json('Not available');
                return;
            }

            let sqlComment = {
                content: comment.content,
                status: comment.status,
                edited: true,
                date: new Date().toJSON().slice(0, 19).replace('T', ' ')
            };
            
            if (roles === 'admin' && rows[0].owner !== 'admin') {
                sqlPost = { status: post.status };
            }

            const sql = `UPDATE comments SET ? WHERE id="${id}"`;
            await mysql.query(sql, sqlComment);
            res.json("Success");
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async deleteComment(id, login, roles, res) {
        try {
            const [rows] = await mysql.query(`SELECT * FROM comments WHERE id="${id}"`);
            if (rows.length === 0) {
                res.status(400).json('Comment already deleted');
                return;
            }

            if (login !== rows[0].owner && roles !== 'admin') {
                res.status(400).json('Not available');
                return;
            }

            const sql = `DELETE FROM comments WHERE id="${id}"`;
            await mysql.query(sql);
            res.json("Success");
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }
}

module.exports = new Comment();