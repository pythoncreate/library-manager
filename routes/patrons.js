'use strict';

var express = require('express');
var router = express.Router();

var Book = require('../models').Book;
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;

/* GET all patrons page. */
router.get('/', function(req, res, next) {
  Patron.findAndCountAll().then(function(results) {
    res.render('all_patrons', {
    title: 'Patrons',
    patrons: results.rows
    });
})
});

///* GET details of a patron */
//router.get("/details/:id", function(req, res, next){
//  Patron.findById(req.params.id).then(function(patron){
//    if(patron){
//      res.render('patron_detail', {patron:patron});
//    } else {
//      res.send(404);
//    }
//  })
//});

// Get book detail + loans
router.get("/details/:id", (req, res)=> {
     const patron = Patron.findById(req.params.id);
     const patron_loans = Loan.findAll({where: {patron_id: req.params.id}, include: [{ model: Patron}, {model: Book}]});

     Promise.all([patron, patron_loans]).then(function(data) {

     res.render('patron_detail', {patron: data[0], patron_loans: data[1]});
  });
});

module.exports = router;
