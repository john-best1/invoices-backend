const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Invoice = new Schema({
    transactionId : String,
    customerId: String,
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
    transactionDate: { type: String, default: new Date().toISOString()},
    completed:{
        type: Boolean,
        default: false
    }
})

var InvoiceModel = mongoose.model('Invoice', Invoice)
module.exports = InvoiceModel