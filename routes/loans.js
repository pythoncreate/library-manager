'use strict';

var express = require('express');
var router = express.Router();

var Book = require('../models').Book;
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;

// Get all loans
router.get('/', function(req, res, next) {
  Loan.findAndCountAll().then(function(results) {
      res.render('all_loans', {
      title: 'Loans',
      loans: results.rows
      });
})
});


module.exports = router;
