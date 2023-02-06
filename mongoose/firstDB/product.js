const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/product')
    .then(() => {
        console.log('Connected to DB');
    }).catch((e) => {
        console.log(`Problem with DB connection ${e}`);
    })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 20
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'pice must be positive']
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        warehouse: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
})
productSchema.statics.fireSale = function () {
    return this.updateMany({ onSale: true, price: 0 })
}

productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale
    return this.save()
}

productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat)
    return this.save()
}

productSchema.methods.greet = function () {
    console.log('Hello !');
    console.log(` - from ${this.name}`);
}
const Product = mongoose.model('Product', productSchema)

Product.fireSale().then(m => console.log(m))

const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: 'Mountain Bike' })
    console.log(foundProduct);
    await foundProduct.toggleOnSale()
    await foundProduct.addCategory('Outdoors')
    console.log(foundProduct);
}


// findProduct()
// const bike = new Product({ name: 'Cycling Jersey', price: 28, categories: ['cycling'], size: 'S' })
// bike.save()
//     .then(() => {
//         console.log('It worked');
//     }).catch((e) => {
//         console.log('Error!');
//         console.log(e);
//     })
// Product.findOneAndUpdate({ name: 'Tire Pump' }, { price: 10.99 }, { new: true, runValidators: true })
//     .then(data => {
//         console.log('It Worked')
//         console.log(data)
//     }).catch(err => {
//         console.log('Error!')
//         console.log(err)
//     })