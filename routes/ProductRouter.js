const express = require('express')
const Router = express.Router()
const Product = require('../models/ProductModel')
const {validationResult} = require('express-validator')
const CheckLogin = require("../auth/CheckLogin")
const rateLimit = require('express-rate-limit')
const addProductValidator = require('./validators/addProductValidator')

const allProductLimiter = rateLimit({
    window: 10 * 1000,
    max: 5,
    message: 
    "Cannot send more than 5 request in 10s when you read list of products !"
})

const detailProductLimiter = rateLimit({
    window: 10 * 1000,
    max: 2,
    message: 
    "Cannot send more than 2 request in 10s when you read detail of product !"
})


Router.get('/', allProductLimiter, (req, res) => {
    Product.find().select('name price desc')
    .then(products => {
        res.json({
            code: 0,
            message: 'Read product successfully !',
            data: products
        })
    })
})

Router.post('/', CheckLogin, addProductValidator , (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {name, price, desc} = req.body
        let product = new Product ({
            name, price, desc
        })

        product.save()
        .then(() => {
            return res.json({code: 0, message: 'Add product successfully !', data: product})
        })
        .catch(e => {
            return res.json({code: 2, message: e.message})
        })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m].msg
            break
        }
        return res.json({code: 1, message: message})
    }
})

Router.get('/:id', detailProductLimiter, (req, res) => {
    let {id} = req.params
    if (!id) {
        return res.json({code: 1, message: 'No product information !'})
    }
    Product.findById(id)
    .then(p => {
        if (p) {
            return res.json({code: 0, message: 'Product found !', data: p})
        }
        else return res.json({code: 2, message: 'Product not found !'})
    })
    .catch (e => {
        if (e.message.includes('Cast to ObjectId failed')) {
            return res.json({code: 3, message: 'Invalid id !'})
        }
        return res.json({code: 3, message: e.message})
    })
})

Router.delete('/:id', CheckLogin, (req, res) => {
    let {id} = req.params
    if (!id) {
        return res.json({code: 1, message: 'No product information !'})
    }
    Product.findByIdAndDelete(id)
    .then(p => {
        if (p) {
            return res.json({code: 0, message: 'Product deleted !'})
        }
        else return res.json({code: 2, message: 'Product not found !'})
    })
    .catch (e => {
        if (e.message.includes('Cast to ObjectId failed')) {
            return res.json({code: 3, message: 'Invalid id !'})
        }
        return res.json({code: 3, message: e.message})
    })
})

Router.put('/:id', CheckLogin, (req, res) => {
    let {id} = req.params
    if (!id) {
        return res.json({code: 1, message: 'No product information !'})
    }

    let supportedFields = ['name', 'price', 'desc']
    let updateData = req.body
    if (!updateData) {
        return res.json({code: 2, message: 'No data need to update !'})
    }

    for (field in updateData) {
        if (!supportedFields.includes(field)) {
            delete updateData[field]
        }
    }
    
    Product.findByIdAndUpdate(id, updateData, {
        new: true
    })
    .then(p => {
        if (p) {
            return res.json({code: 0, message: 'Product updated !', data: p})
        }
        else return res.json({code: 2, message: 'Product not found by id !'})
    })
    .catch (e => {
        if (e.message.includes('Cast to ObjectId failed')) {
            return res.json({code: 3, message: 'Invalid id !'})
        }
        return res.json({code: 3, message: e.message})
    })
})


module.exports = Router