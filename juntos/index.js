const express = require('express');
const app = express()
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/products')

mongoose.connect('mongodb://localhost:27017/farmStand')
    .then(() => {
        console.log("MONGODB connected");
    })
    .catch((e) => {
        console.log("MONGODB ERROR");
        console.log(e);
    })
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})

app.get('/products/new', (req, res) => {
    res.render('products/new')
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('products/show', { product })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save()
    res.redirect(`products/${newProduct._id}`)
})
app.listen(3000, () => {
    console.log("SERVER IS LISTENING TO PORT 3000");
})
