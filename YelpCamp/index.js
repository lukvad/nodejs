const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const method = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./AppError');
const { wrap } = require('module');

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

app.use(morgan('tiny'))

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

app.get('/campgrounds', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        return next(new AppError('Product not found', 404))
    }
    res.render('campgrounds/edit', { campground })
}))


app.get('/campgrounds/:id', wrapAsync(async (req, res, next) => {

    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        throw new AppError('Product not found', 404)
    }
    res.render('campgrounds/show', { campground })
}))

app.put("/campgrounds/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true })
    if (!campground) {
        throw new AppError('No such Id', 404)
    }
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.post('/campgrounds', wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    if (!campground) {
        throw new AppError('no campground posted', 404)
    }
    await campground.save()
    res.render('campgrounds/show', { campground })
}))

app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    if (!campground) {
        throw new AppError('No such Id', 404)
    }
    res.redirect('/campgrounds')
}))




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

const handleValError = err => {
    console.dir(err);
    return err
}

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') err = handleValError(err)
    next(err)
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err
    res.status(status).send(message)
})



app.listen(3000, () => {
    console.log("Listening to port 3000");
})
