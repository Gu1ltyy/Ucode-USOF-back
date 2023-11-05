const mysql = require('../db/db.js');

class Categories {
    async getAllCategories(res) {
        const sql = 'SELECT * FROM categories';

        try {
            const [rows, fields] = await mysql.query(sql);
            res.json(rows);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async getCategoryById(id, res) {
        const sql = 'SELECT * FROM categories WHERE id=?';

        try {
            const rows = await mysql.query(sql, id);
            if (rows.length === 0) {
                res.status(400).json('Not found');
            } else {
                res.json(rows[0]);
            }
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async getPostByCategory(id, res) {
        const sql = 'SELECT * FROM categories WHERE id=?';

        try {
            const rows = await mysql.query(sql, id);
            if (rows.length === 0) {
                res.status(400).json('Not found');
                return;
            }

            let categories = rows[0].title;
            const posts = await mysql.query('SELECT * FROM posts');

            let resultArr = [];

            posts.forEach(element => {
                if (element.categories.includes(categories)) {
                    resultArr.push(element);
                }
            });

            res.json(resultArr);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async createCategory(content, res) {
        const sql = 'INSERT INTO categories SET ?';

        try {
            const result = await mysql.query(sql, content);
            res.json('Success');
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async changeCategories(id, content, res) {
        const sql = `UPDATE categories SET ? WHERE id="${id}"`;

        try {
            const [result] = await mysql.query(sql, content);
            if (result.affectedRows === 0) {
                res.status(404).json('Category not found');
            } else {
                res.json('Success');
            }
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async deleteCategories(id, res) {
        const sql = 'DELETE FROM categories WHERE id=?';

        try {
            const [result] = await mysql.query(sql, id);
            if (result.affectedRows === 0) {
                res.status(404).json('Category not found');
            } else {
                res.json('Success');
            }
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }
}

module.exports = new Categories();