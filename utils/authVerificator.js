const tokenManager = require('../utils/tokenManager');

module.exports = function (req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization)
            return res.status(401).json('Unauthorized Error: No authorization header found');

        const accessToken = authorization.split(' ')[1];
        if (!accessToken)
            return res.status(401).json('Unauthorized Error: No access token found');

        const userData = tokenManager.validateToken(accessToken);
        if (!userData)
            return res.status(401).json('Unauthorized Error: Invalid access token');

        req.user = userData;
        next();
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};