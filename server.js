const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Invoice = require('./models/Invoice')

const app = express()
const router = express.Router()

const secret = "ilovesalmonsandwiches"
var jwt = require('jsonwebtoken')

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
        res.json(invoices);
      });
})

// list of all uncompleted invoices, for admin main page
router.get(('/invoices/invoicesAdmin'),function(req,res){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token)
        //verify secret
        jwt.verify(token, secret, Invoice.find({completed: false}, function(err, invoices){
            if(err) {
              res.json({status: false, error: "Something went wrong"});
              return;
            }
            res.json(invoices);
          }).limit(25).sort({transactionDate: -1}));  // return a maximum of 25 invoices (narrow down via search), sort by most recent transaction first
    else 
        return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    })
})

// list of all uncompleted invoices, for admin main page with filter
router.get(('/invoices/invoicesAdmin/:filter'),function(req,res){
    let filter = req.params.filter
    Invoice.find({$and:[
        {completed: false},
        {$or : [
            {customerName:{ $regex: ".*" + filter + ".*", $options: "i"}},
            {customerId:{ $regex: ".*" + filter + ".*", $options: "i"}},
            {transactionId:{ $regex: ".*" + filter + ".*", $options: "i"}},
            ]
        }
        ]}, function(err, invoices){
        if(err) return handleError 
        else res.json(invoices)
    }).limit(25).sort({transactionDate: -1})  // return a maximum of 25 invoices (narrow down via search), sort by most recent transaction first
})

//returns a list of completed invoices for a particular customer
router.route('/invoices/customerInvoices/:customerId').get((req,res) => {
    Invoice.find({customerId: req.params.customerId, completed: true}, function(err, invoices){
        if(err) return handleError 
        else res.json(invoices)
    })
})

//returns an invoice from invoice id
router.route('/invoices/customerInvoice/:id').get((req,res) => {
    Invoice.findOne({_id : req.params.id, completed: true}, function(err, invoices){
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
            res.json('Sent successfully')
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



// get invoice by invoice Id
router.route('/invoices/:id').get((req, res) => {
    Invoice.findById(req.params.id, (err, invoice) => {
        if(err)
            console.log(err)
        else
            res.json(invoice)
    })
})

// // FOR SOME REASON THIS CRASHES POSTMAN ALTHOUGH IT SEEMS SOUND
// // delete invoice by invoice Id
// router.route('/invoices/delete/:id').get((req, res) => {
//     Invoice.findOneAndDelete({_id: req.params.id}), (err, invoice) => {
//         if (err)
//             res.json(err)
//         else
//             res.json('Deleted successfully')
//     }
// })


//start the server
app.listen(4000, () => console.log('Express server running on port 4000'))

// register route
app.use('/', router)