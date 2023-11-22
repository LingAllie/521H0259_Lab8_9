const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Account = require('../models/AccountModel')

const {validationResult} = require('express-validator')
const registerValidator = require('./validators/registerValidator')
const loginValidator = require('./validators/loginValidator')

Router.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Account route'
    })
})

Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        let {email, password} = req.body
        let account = undefined

        Account.findOne({email: email})
        .then(acc => {
            if (!acc) {
               throw new Error('Email has not been signed !') 
            }
            account = acc
            return bcrypt.compare(password, acc.password)
        })
        .then(passwordMatch => {
            if(!passwordMatch) {
                return res.status(401).json({code: 3, message: 'Login fail, password incorrect !'})
            }
            const {JWT_SECRET} = process.env
            jwt.sign({
                email: account.email,
                fullname: account.fullname
            }, JWT_SECRET, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) throw err
                return res.json({
                    code: 0,
                    message: 'Login successfully !',
                    token: token
                })
            })
        })
        .catch(e => {
            return res.status(401).json({code: 2, message: 'Login fail !' + e.message})
        })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (let m in messages) {
            message = messages[m].msg
            break
        }
        res.json({code: 1, message: message}) 
    }
})

Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req)
    if(result.errors.length === 0) {

        let {email, password, fullname} = req.body
        Account.findOne({email: email})
        .then(acc => {
            if (acc) {
               throw new Error('This account has been used (email)') 
            }
        })
        .then(() => bcrypt.hash(password, 10) )
        
        .then(hashed => {

            let user = new Account({
                email: email,
                password: hashed,
                fullname: fullname
            })
            return  user.save();
        })
        .then(() => {
            return res.json({code: 0, message: 'Register successfully !'})
        })
        .catch(e => {
            return res.json({code: 2, message: 'Register fail !' + e.message})
        })     
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (let m in messages) {
            message = messages[m].msg
            break
        }
        res.json({code: 1, message: message}) 
    } 
})

module.exports = Router