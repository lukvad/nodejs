const express = require('express');
const path = require('path');
const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', { num })
})
app.get('/:subreddit', (req, res) => {
    const { subreddit } = req.params
    res.render('subreddit', { subreddit })
})
app.listen(3000, () => {
    console.log('Listening to port 3000');
})