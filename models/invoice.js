const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Invoice = new Schema({
    transactionId : Number,
    customerId: Number,
    customerName: String,
    customerStreetAddress: String,
    city: String,
    countyOrState: String,
    postcode: String,
    phone: String,
    email: String,
    orders:[{
        itemId: Number,
        description: String,
        price: Number,
        quantity: Number
    }],
    transactionDate: String,
    completed:{
        type: Boolean,
        default: false
    }
})

var InvoiceModel = mongoose.model('Invoice', Invoice)
module.exports = InvoiceModel