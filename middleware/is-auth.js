const Jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    if (req.user) {
        return res.send({
            message: 'User is authenticated',
            user: req.user
        })
    }

    const AuthHeader = req.get('Authorization');

    if (!AuthHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = AuthHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = Jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        error.statusCode = 500;
        throw error
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 500;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
}