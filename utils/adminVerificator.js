module.exports = function (req, res, next) {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json('Forbidden: You are not authorized as admin');
        }

        next();
    } catch (error) {
        console.error('An error occurred during authorization:', error);
        return res.status(500).json('Internal Server Error');
    }
};