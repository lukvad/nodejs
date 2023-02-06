const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/product')
    .then(() => {
        console.log('Connected to DB');
    }).catch((e) => {
        console.log(`Problem with DB connection ${e}`);
    })

const personSchema = new mongoose.Schema({
    first: String,
    last: String
})

personSchema.virtual('fullName').get(function () {
    return (`${this.first} ${this.last}`)
})
personSchema.pre('save', function () {
    console.log('About to save!')
})
personSchema.post('save', function () {
    console.log('Just saved!')
})

const Person = mongoose.model('Person', personSchema)