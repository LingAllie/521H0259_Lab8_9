const {check} = require('express-validator')

module.exports =  [
    check('email')
    .exists().withMessage('Please enter email address !')
    .notEmpty().withMessage('Email address must be filled in !')
    .isEmail().withMessage('Invalid email !'),

    check('password')
    .exists().withMessage('Please enter password !')
    .notEmpty().withMessage('Password must be filled in !')
    .isLength().withMessage('Password must have at least 6 characters !'),

    check('fullname')
    .exists().withMessage('Please enter username !')
    .notEmpty().withMessage('Username must be filled in !')
    .isLength().withMessage('Username must have at least 6 characters !')
]
