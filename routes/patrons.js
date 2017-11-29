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

/* GET details of a patron */
router.get("/details/:id", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){
    if(patron){
      res.render('patron_detail', {patron:patron});  
    } else {
      res.send(404);
    }
  })
});


module.exports = router;
