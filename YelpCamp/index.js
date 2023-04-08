const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const method = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const { campgroundSchema } = require('./schemas.js')

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

const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next()
    }
}

app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        return next(new expressError('Product not found', 404))
    }
    res.render('campgrounds/edit', { campground })
}))


app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {

    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        throw new expressError('Product not found', 404)
    }
    res.render('campgrounds/show', { campground })
}))

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res, next) => {
    if (!req.body.campground) {
        throw new expressError('Invalid Data Posted', 400)
    }
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true })
    if (!campground) {
        throw new expressError('No such Id', 404)
    }
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {


    const campground = new Campground(req.body.campground)
    await campground.save()
    res.render('campgrounds/show', { campground })
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    if (!campground) {
        throw new expressError('No such Id', 404)
    }
    res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listening to port 3000");
})
