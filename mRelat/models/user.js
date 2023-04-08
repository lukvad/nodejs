const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mRelat', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected');
})

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            }
        }
    ]
})

const User = mongoose.model('User', userSchema)

const makeUser = async () => {
    User.deleteMany({})
    const u = new User({
        first: 'Harry',
        last: 'Potter',

    })
    u.addresses.push({
        street: '123 Sezame Str',
        city: 'New York',
        state: 'NY',
        country: 'USA'
    })
    const res = await u.save()
    console.log(res);
}


const addAdress = async (id) => {
    const user = await User.findById(id)
    user.addresses.push({
        street: '99 Ave Str',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA'
    })
    const res = await user.save()
    console.log(res);
}
addAdress('642bec23455efe9ced3af98b')