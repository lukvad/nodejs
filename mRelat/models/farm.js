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

const productSchema = new Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enom: ['Spring', 'Summer', 'Winter', 'Autumn']
    }
})
const farmSchema = new Schema({
    name: String,
    city: String,
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})

const Product = mongoose.model('Product', productSchema)
const Farm = mongoose.model('Farm', farmSchema)

// Product.insertMany([
//     { name: 'Goddess Melon', price: 4.99, season: 'Summer' },
//     { name: 'Sugar Baby Watermelon', price: 2.99, season: 'Summer' },
//     { name: 'Asparagus', price: 6.99, season: 'Spring' },
// ])



const makeFarm = async () => {
    const farm = new Farm({
        name: 'Full Belly Silly',
        city: 'Guinda, CA'
    })
    const melon = await Product.findOne({ name: 'Goddess Melon' })
    farm.products.push(melon)
    farm.save()
}


const addProduct = async () => {
    const farm = await Farm.findOne({
        name: 'Full Belly'
    })
    const watermelon = await Product.findOne({
        name: 'Sugar Baby Watermelon'
    })
    farm.products.push(watermelon)
    await farm.save()
    console.log(farm);
}


Farm.findOne({ name: 'Full Belly' }).populate('products').then(farm => console.log(farm))