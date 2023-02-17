const express = require('express');
const app = express()
const methodOverride = require('method-override')
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/products')
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB');
    }).catch((e) => {
        console.log('Problem');
        console.log(e);
    })

app.use(express.urlencoded({ extended: true, async: true }));
app.use(methodOverride('_method'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('index', { products })
})

app.listen(3000, () => {
    console.log('Listening to port 3000');
})



