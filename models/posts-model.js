const mysql = require('../db/db.js');
const filters = require('../utils/filters');

class Post {
    async createPost(login, id, post, res) {
        try {
            const sqlPost = {
                owner: login,
                title: post.title,
                owner_id: id,
                content: post.content,
                categories: JSON.stringify(post.categories),
                date: new Date().toJSON().slice(0, 19).replace('T', ' ')
            };
    
            const sql = 'INSERT INTO posts SET ?';

            await mysql.query(sql, sqlPost);
            res.json("Success");
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }
    
    async getAllPost(page, categories, date, sort, search, isAdmin, res) {
        try {
            let baseSql = isAdmin ? 'SELECT * FROM posts' : 'SELECT * FROM posts WHERE status="1"';
            let filterSql = filters.getCategoriesSql(categories, date, isAdmin) || baseSql;
            let [rows] = await mysql.query(filterSql);
    
            const postsPerPage = 10;
            const numOfResults = rows.length;
            const numberOfPages = Math.ceil(numOfResults / postsPerPage);
            const startingLimit = (page - 1) * postsPerPage;
    
            let sortSql = sort ? ` ORDER BY ${sort.split('-').join(' ')}` : ' ORDER BY rating DESC';
            let searchSql = search ? ` AND (title LIKE '%${search}%' OR content LIKE '%${search}%')` : '';
            let limitSql = ` LIMIT ${startingLimit},${postsPerPage}`;
    
            let finalSql = filterSql + searchSql + sortSql + limitSql;
            let [resultRows] = await mysql.query(finalSql);
    
            const resultArr = resultRows.map((element) => {
                return Object.assign(element, { pages: numberOfPages });
            });
    
            res.json(resultArr);
        } catch (error) {
            res.status(400).json('Internal Server Error');
        }
    }    
    
    async getPostById(id, res) {
        try {
            const sql = 'SELECT * FROM posts WHERE id=?';
            const [rows, fields] = await mysql.query(sql, id);
    
            if (rows.length === 0) {
                res.status(404).json('Post not found');
                return;
            }
    
            res.json(rows[0]);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }    

    async getPostCategories(id, res) {
        try {
            const sql = 'SELECT * FROM posts WHERE id=?';
            const [rows, fields] = await mysql.query(sql, id);

            if (rows.length === 0) {
                res.status(404).json('Post not found');
                return;
            }

            res.json(rows[0].categories);
        } catch (err) {
            res.status(400).json('Internal Server Error');
        }
    }

    async changePost(id, login, roles, post, res) {
        try {
            const [rows] = await mysql.query(`SELECT * FROM posts WHERE id="${id}"`);
            if (rows.length === 0) {
                res.status(400).json('Post not found');
                return;
            }

            if (login !== rows[0].owner && roles !== 'admin') {
                res.status(400).json('Not available');
                return;
            }

            let sqlPost = {
                title: post.title,
                content: post.content,
                categories: JSON.stringify(post.categories),
                status: post.status,
                edited: true,
                date: new Date().toJSON().slice(0, 19).replace('T', ' ')
            };

            if (roles === 'admin' && rows[0].owner !== 'admin') {
                sqlPost = { status: post.status };
            }

            const sql = `UPDATE posts SET ? WHERE id="${id}"`;
            await mysql.query(sql, sqlPost);
            res.json("Success");
        } catch (error) {
            res.status(400).json('Internal Server Error');
        }
    }

    async deletePost(id, login, roles, res) {
        try {
            const [rows] = await mysql.query(`SELECT * FROM posts WHERE id="${id}"`);
            if (rows.length === 0) {
                res.status(400).json('Post already deleted');
                return;
            }

            if (login !== rows[0].owner && roles !== 'admin') {
                res.status(400).json('Not available');
                return;
            }

            const sql = `DELETE FROM posts WHERE id="${id}"`;
            await mysql.query(sql);
            res.json("Success");
        } catch (error) {
            res.status(400).json('Internal Server Error');
        }
    }
}

module.exports = new Post();