const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Invoice = require('./models/Invoice')

const app = express()
const router = express.Router()

app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/invoices')

const connection = mongoose.connection

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!')
})



// list of all invoices, completed and uncompleted
router.get(('/invoices'),function(req,res){
    Invoice.find({}, function(err, invoices){
        if(err) {
          res.json({status: false, error: "Something went wrong"});
          return;
        }
        res.json({status: true, invoice: invoices});
      });
})

// list of all uncompleted invoices, for admin main page
router.get(('/invoices/invoicesAdmin'),function(req,res){
    Invoice.find({completed: false}, function(err, invoices){
        if(err) return handleError 
        else res.json(invoices)
    })
})

//returns a list of completed invoices for a particular customer
router.route('/invoices/customerInvoices/:customerId').get((req,res) => {
    Invoice.find({customerId: req.params.customerId, completed: true}, function(err, invoices){
        if(err) return handleError 
        else res.json(invoices)
    })
})


// Staff sending an invoice
router.route('/invoices/update/:id').post((req, res) => {
    Invoice.findByIdAndUpdate(req.params.id, {completed: true},(err, invoice) => {
        if (err)
            res.json(err)
        else
            res.json('Removed successfully')
    })
})

// adding an invoice object to database
router.route('/invoices/add').post((req,res) => {
    let invoice = new Invoice(req.body)
    invoice.save()
        .then(invoice => {
            res.status(200).json({'invoice': 'Added successfully'})
        })
        .catch(err => {
            res.status(400).send('Failed to create new record')
        })
})




app.listen(4000, () => console.log('Express server running on port 4000'))

app.use('/', router)