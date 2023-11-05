const tockenManager = require('./tokenManager');

module.exports = function (req, res, next) {
    try {
        req.isAdmin = false;

        if (req.headers.authorization) {
            const authorizationHeader = req.headers.authorization;

            const accessToken = authorizationHeader.split(' ')[1];
            const userData = tockenManager.validateToken(accessToken);
            if (userData && userData.roles === 'admin')
                req.isAdmin = true;
        }

        next();
    } catch (error) {
        console.error('An error occurred during admin flag check:', error);
        return res.status(500).json('Internal Server Error');
    }
};
