var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

var Invoice = require('../models/invoice');

describe("Get all Invoices", function(){
    // Test will pass if we get all invoices
   it("should return all invoices", function(done){
       var InvoiceMock = sinon.mock(Invoice);
       var expectedResult = {status: true, invoice: []};
       InvoiceMock.expects('find').yields(null, expectedResult);
       Invoice.find(function (err, result) {
           InvoiceMock.verify();
           InvoiceMock.restore();
           expect(result.status).to.be.true;
           done();
       });
   });
   // Test will pass if we fail to get a invoice
   it("should return error", function(done){
    var InvoiceMock = sinon.mock(Invoice);
    var expectedResult = {status: false, error: "Something went wrong"};
    InvoiceMock.expects('find').yields(expectedResult, null);
    Invoice.find(function (err, result) {
        InvoiceMock.verify();
        InvoiceMock.restore();
        expect(err.status).to.not.be.true;
        done();
    });
});
})




describe("Post a new invoice", function(){
    // Test will pass if the invoice is saved
    it("should create new invoice", function(done){
        var InvoiceMock = sinon.mock(new Invoice({transactionId : 9999 ,customerId: 9999,customerName: "John Smith",customerStreetAddress: "3 The Street", city: "CityVille",
                                        countyOrState: "Statington", postcode: "dh5124", phone: "01234345654", email: "fake@gmail.com",
                                        orders:[{itemId: 1 ,description: "lemons", price: "5", quantity: "15"}],
                                            transactionDate: "10/10/2010"}));
        var invoice = InvoiceMock.object;
        var expectedResult = { status: true };
        InvoiceMock.expects('save').yields(null, expectedResult);
        invoice.save(function (err, result) {
            InvoiceMock.verify();
            InvoiceMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    // Test will pass if the invoice is not saved
    it("should return error, if invoice not saved", function(done){
        var InvoiceMock = sinon.mock(new Invoice({transactionId : 9999 ,customerId: 9999,customerName: "John Smith",customerStreetAddress: "3 The Street", city: "CityVille",
                                            countyOrState: "Statington", postcode: "dh5124", phone: "01234345654", email: "fake@gmail.com",
                                            orders:[{itemId: 1 ,description: "lemons", price: "5", quantity: "15"}],
                                                transactionDate: "10/10/2010"}));
        var invoice = InvoiceMock.object;
        var expectedResult = { status: false };
        InvoiceMock.expects('save').yields(expectedResult, null);
        invoice.save(function (err, result) {
            InvoiceMock.verify();
            InvoiceMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    }); 
})


// Test will pass if the invoice is updated based on an ID
describe("Update a new invoice by id", function(){
it("should updated an invoice by id", function(done){
    var InvoiceMock = sinon.mock(new Invoice({ completed: true}));
    var invoice = InvoiceMock.object;
    var expectedResult = { status: true };
    InvoiceMock.expects('save').withArgs({_id: 12345}).yields(null, expectedResult);
    invoice.save(function (err, result) {
    InvoiceMock.verify();
    InvoiceMock.restore();
    expect(result.status).to.be.true;
    done();
    });
});
// Test will pass if the invoice is not updated based on an ID
it("should return error if update action is failed", function(done){
    var InvoiceMock = sinon.mock(new Invoice({ completed: true}));
    var invoice = InvoiceMock.object;
    var expectedResult = { status: false };
    InvoiceMock.expects('save').withArgs({_id: 12345}).yields(expectedResult, null);
    invoice.save(function (err, result) {
        InvoiceMock.verify();
        InvoiceMock.restore();
        expect(err.status).to.not.be.true;
        done();
    });
    });
});

