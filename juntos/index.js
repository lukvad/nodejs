const express = require('express');
const methodOverride = require('method-override');
const app = express()
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/products')
const categories = ['fruit', 'vegetables', 'dairy', 'fungi']

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
app.use(methodOverride('_method'))

app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect(`/products/${id}`)
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products')
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
