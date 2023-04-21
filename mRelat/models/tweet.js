const mongoose = require('mongoose');
const { Schema } = mongoose
mongoose.connect('mongodb://localhost:27017/mRelat', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected');
})

const userSchema = new Schema({
    username: String,
    age: Number
})

const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema)
const Tweet = mongoose.model('Tweet', tweetSchema)


const makeTweets = () => {
    const user = new User({ username: 'chickenFan99', age: 61 })
    const tweet1 = new Tweet({ text: 'This is a tweet', likes: 0 })
    const tweet2 = new Tweet({ text: 'This is a tweet #2', likes: 0 })
    tweet1.user = user
    tweet2.user = user
    tweet1.save()
    tweet2.save()
    user.save()
}
makeTweets()