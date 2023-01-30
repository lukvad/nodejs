const express = require('express');
const path = require('path');
const app = express()
const redditData = require('./data.json');


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/cats', (req, res) => {
    const cats = [
        'Blue', 'Rocket', 'Monty', 'Stephanie', 'Joe'
    ]
    res.render('cats', { cats })
})

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', { num })
})
app.get('/:subreddit', (req, res) => {
    const { subreddit } = req.params
    const data = redditData[subreddit]
    if (data) {
        res.render('subreddit', { ...data })
    } else
        res.render('notfound', { subreddit })
})
app.listen(3000, () => {
    console.log('Listening to port 3000');
})