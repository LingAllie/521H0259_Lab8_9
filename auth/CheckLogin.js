const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    let authorization = req.header('Authorization')
    if (!authorization) {
        return res.status(401)
        .json({code: 101, message: 'Please provide token via header !'})
    }

    let token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401)
        .json({code: 101, message: 'Please provide valid jwt token !'})
    }

    const {JWT_SECRET} = process.env
   
    jwt.verify(token, JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(401)
            .json({code: 101, message: "Token invalid or expired !"})
        }
        req.user = data
        next();
    })
}