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

// Get Patron detail + loans
router.get("/details/:id", (req, res)=> {
  const patron = Patron.findById(req.params.id);
  const loans = Loan.findAll({where: {patron_id: req.params.id}, include: [{ model: Patron}, {model: Book}]});

  Promise.all([patron, loans]).then(function(data) {

  res.render('patron_detail', {patron: data[0], loans: data[1]});
});
});

/* POST Update Patron */
router.post("/details/:id", function(req, res, next){
  console.log(req.body);
  Patron.update(req.body, {
    where: [{id: req.params.id}]
  })
  .then((patron) => {
    res.redirect("/patrons");
  })
  .catch(function(error){
      if(error.name === "SequelizeValidationError") {
      const patron = Patron.build(req.body);
      const loans = Loan.findAll({where: {patron_id: req.params.id}, include: [{ model: Patron}, {model: Book}]});
      Promise.all([patron, loans]).then(function(data){
        res.render("patron_detail", {patron: data[0], loans: data[1], errors: error.errors})
      })
    } else {
      throw error;
    }
    }).catch(function(error){
        res.send(500, error);
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