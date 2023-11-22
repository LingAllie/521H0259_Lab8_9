const {check} = require('express-validator')

module.exports =  [
    check('name')
    .exists().withMessage('Please provide name product !')
    .notEmpty().withMessage('Name product must be filled in !'),

    check('price')
    .exists().withMessage('Please provide price product !')
    .notEmpty().withMessage('Price product must be filled in !')
    .isNumeric().withMessage('rice product must be numeric type !'),

    check('desc')
    .exists().withMessage('Please provide describe product !')
    .notEmpty().withMessage('Describe product must be filled in !')
]
