class FilterService {
    getCategoriesSql(categories, date, isAdmin) {
        const filters = [];
        if (date) filters.push(`(DATE(date) BETWEEN ? AND ?)`);
        if (categories && categories.length) {
            const categoryFilter = typeof categories === 'string'
                ? `JSON_CONTAINS(categories, ?)`
                : `JSON_OVERLAPS(categories, ?)`;
            filters.push(categoryFilter);
        }
        if (!isAdmin) filters.push(`status="1"`);

        const sql = `SELECT * FROM posts` + (filters.length ? ` WHERE ${filters.join(' AND ')}` : '');
        
        return sql;
    }
}
  
module.exports = new FilterService();