const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database.');

        const sqlScript = fs.readFileSync(path.join(__dirname, 'db.sql'), 'utf8');
        await connection.query(sqlScript);
        connection.release();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        console.log('Database setup completed.');
    }
})();

module.exports = pool;