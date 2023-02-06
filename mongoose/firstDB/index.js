const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movies')
    .then(() => {
        console.log('Connected to DB');
    }).catch((e) => {
        console.log(`Problem with DB connection ${e}`);
    })

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
})
const Movie = mongoose.model('Movie', movieSchema)
Movie.insertMany([
    { title: 'Amelie', year: 2001, score: 8.5, rating: 'R' },
    { title: 'Moonrise Kingdom', year: 2012, score: 8.1, rating: 'PG-13' },
    { title: 'Alien', year: 1979, score: 7.9, rating: 'R' },
    { title: 'The Iron Giant', year: 1999, score: 7.5, rating: 'PG' },
    { title: 'Stand By Me', year: 1986, score: 8.6, rating: 'R' }
]).then((data) => {
    console.log('It worked ');
    console.log(data);
}) 