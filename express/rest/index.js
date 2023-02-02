const express = require('express');
const path = require('path')
const methodOverride = require('method-override');
const app = express()
const { v4: uuid } = require('uuid');
let comments =
    [
        {
            id: uuid(),
            username: 'Todd',
            comment: 'lol, that is sooo funny'
        },
        {
            id: uuid(),
            username: 'John',
            comment: 'Why are you so intollerant'
        },
        {
            id: uuid(),
            username: 'Lucas',
            comment: 'no , it isn\'t'
        },
        {
            id: uuid(),
            username: 'Matt',
            comment: 'I hope you die'
        }
    ]
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/comments', (req, res) => {
    res.render('comments/index', { comments })
})
app.get('/comments/new', (req, res) => {
    res.render('comments/new')
})
app.get('/comments/:id', (req, res) => {
    const { id } = req.params
    const comment = comments.find(c => c.id === id)
    res.render('comments/show', { comment })
})
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params
    const comment = comments.find(c => c.id === id)
    res.render('comments/edit', { comment })
})
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params
    const foundComment = comments.find(c => c.id === id)
    const newComment = req.body.comment
    foundComment.comment = newComment
    res.redirect('/comments')
})
app.post('/comments', (req, res) => {
    const { username, comment } = req.body
    const id = uuid()
    comments.push({ id, username, comment })
    res.redirect('/comments')
})

app.delete('/comments/:id', (req, res) => {
    const { id } = req.params
    comments = comments.filter(c => c.id !== id)
    res.redirect('/comments')
})
// app.get('/tacos', (req, res) => { 
//     res.send('get /tacos response')
// })
// app.post('/tacos', (req, res) => {
//     const { meat, qty } = req.body
//     res.send(`OK here are your ${meat} tacos - ${qty} piece/s`)
// })


app.listen(3000, () => {
    console.log('Listening to port 3000');
})
