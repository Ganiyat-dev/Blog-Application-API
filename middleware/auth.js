const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = () => {
    return async (req, res, next) => {
       try {
            const token = req.headers.authorization
            if (!token) {   
                return res.status(401).send({
                    message: 'No token provided'
                });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).send({
                    message: 'Unauthorized user'
                });
            }
            req.USER_ID = user.id
            next();
        } catch (error) {
            return res.status(401).send({
                message: 'Invalid token'
            });
        }
    }
}