const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = () => {
    return async (req, res, next) => {
       try {
            const token = req.headers.authorization
            if (!token) throw new Error('Token not found')
            // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const decoded = jwt.decode(token)

            const user = await User.findById(decoded.id)
            if (!user) throw new Error('Unauthorized user')

            req.USER_ID = user.id
            next()
        } catch (error) {
            next(error)
        }
    }
}