require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const ProductRouter = require('./routes/ProductRouter')
const OrderRouter = require('./routes/OrderRouter')
const AccountRouter = require('./routes/AccountRouter')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.json({
    code: 0,
    message: 'Welcome to my REST API!'
  })
})

app.use('/products', ProductRouter)
app.use('/orders', OrderRouter)
app.use('/account', AccountRouter)

const port = process.env.PORT || 1050

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to the database')
    app.listen(port, () => {
      console.log('Server is running at http://localhost:' + port)
    })
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message)
  })
