const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const method = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./AppError');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected');
})

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(method('_method'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

app.use(morgan('tiny'))


app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})
app.get('/campgrounds/:id', async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        return next(new AppError('Product not found', 404))
    }
    res.render('campgrounds/show', { campground })
})

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.render('campgrounds/show', { campground })
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})



app.get('/error', (req, res) => {
    chicken.fly()
})


const verifyPassword = (req, res, next) => {
    const { password } = req.query
    if (password === 'chickennuggets') {
        return next()
    }
    throw new AppError('Password needed!', 401)
}
app.get('/secret', verifyPassword, (req, res) => {
    res.send('My secret is : bla bla')
})

app.get('/admin', (req, res) => {
    throw new AppError('You are not an admin!', 403)
})

// app.use((err, req, res, next) => {
//     console.log('******************************************');
//     console.log('******************ERROR*******************');
//     console.log('******************************************');
// })
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err
    res.status(status).send(message)
})

app.listen(3000, () => {
    console.log("Listening to port 3000");
})
