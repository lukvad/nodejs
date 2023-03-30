const mongoose = require('mongoose');
const Schema = mongoose.Schema

const CampGroundSchema = new Schema({
    title: {
        type: String,
        required: [true, 'name cannot be blank']
    },
    image: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: String,
    location: {
        type: String,
        required: [true, 'name cannot be blank']
    }
})

module.exports = mongoose.model('Campground', CampGroundSchema)