const express = require('express');
const app = express()
// app.use((req, res) => {
//     console.log('We got a new request!');
//     // res.send("Hello, we got your request")
//     // res.send({ color: 'red' })

// })
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params
    res.send(`<h1>Browsing the ${subreddit} subreddit`)
})
app.get('/r/:subreddit/:postId', (req, res) => {
    const { subreddit, postId } = req.params
    res.send(`<h1>Browsing the ${subreddit} subreddit of the ${postId}`)
})

app.post('/horses', (req, res) => {
    res.send('This is post request!')
})

app.get('/cats', (req, res) => {
    res.send('Cats request!')
})

app.get('/dogs', (req, res) => {
    res.send('Dogs request!')
})

app.get('/', (req, res) => {
    res.send('Homepage!')
})

app.get('/search', (req, res) => {
    const { q } = req.query
    if (!q) {
        res.send('There was no search!!!')
    }
    res.send(`<h1>Search results for ${q}`)
})

app.get('*', (req, res) => {
    res.send('I dont know that route')
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})