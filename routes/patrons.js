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

/* POST Update Patron */
router.post("/details/:id", function(req, res, next){
  Patron.findById(req.params.id).then(function(patron){
    if(patron) {
      return patron.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(patron){
    res.redirect("/patrons");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var article = Patron.build(req.body);
        patron.id = req.params.id;
        res.render("patrons/details/" + patron.id, {patron: patron, errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
})

// Get Patron detail + loans
router.get("/details/:id", (req, res)=> {
     const patron = Patron.findById(req.params.id);
     const patron_loans = Loan.findAll({where: {patron_id: req.params.id}, include: [{ model: Patron}, {model: Book}]});

     Promise.all([patron, patron_loans]).then(function(data) {

     res.render('patron_detail', {patron: data[0], patron_loans: data[1]});
  });
});

/* Create a new patron form. */
router.get('/new', function(req, res, next) {
  res.render("new_patron", {patron: {}});
});

/* POST create Patron. */
router.post('/', function(req, res, next) {
  Patron.create(req.body).then(function(patron) {
    res.redirect("/patrons");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("new_patron", {patron: Patron.build(req.body), errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

module.exports = router;
