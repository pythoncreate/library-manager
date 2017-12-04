'use strict';

var express = require('express');
var router = express.Router();

const { Sequelize, Loan, Book, Patron } = require('../models');


//Get ALL Loans
router.get('/', (request, response) => {
    let options = {include: [{ model: Book }, { model: Patron }] };
  Loan.findAll(options)
    .then(loans => {
      response.render('all_loans', { loans , title:"Loans"});

    })
    .catch(err => {
      console.log(err);
      response.sendStatus(500);
    });
});

//Get OVERDUE Loans
router.get('/overdue_loans', (request, response) => {
    Loan.findAll({
        where: {
            return_by: { $lt: new Date() },
            returned_on:  null
            },
        include: [ {model: Book}, {model:Patron}
        ],
    })
    .then(result => {
        response.render('overdue_loans', {
        overdue_loans: result,
        title:"Overdue Loans"
        })
    });
});

//GET Checked out Loans
router.get('/checked_loans', (request, response) => {
    Loan.findAll({
        where: {
            returned_on:  null
            },
        include: [ {model: Book}, {model:Patron}
        ],
    })
    .then(result => {
        response.render('checked_loans', {checked_loans: result, title:"Checked Out Loans"})
    });
});

/* Create a new loan form. */
router.get('/new', function(req, res, next) {
   const books = Book.findAll();
   const patrons = Patron.findAll();
   let loan;

   Promise.all([books, patrons]).then(function(data) {

   res.render('new_loan', {books: data[0], patrons: data[1], loan: {}});
});
});

/* POST a NEW LOAN*/
router.post('/new', function(req, res, next) {
  Loan.create(req.body).then(function(loan) {
    res.redirect("/loans");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("new_loan", {loan: Loan.build(req.body), errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

/* GET Return Form*/
router.get('/:id/return', function(req,res) {
    Loan.findAll({where: {id: req.params.id}, include: [{ model: Patron}, {model: Book}]})
    .then(loans => {
      res.render('return_book', { loan:loans[0], patron:loans[1], book:loans[2]});

    })
    .catch(err => {
      console.log(err);
      response.sendStatus(500);
    });
});

/* PUT Return Form*/
router.post("/:id/return", function(req,res) {
    Loan.findById(req.params.id).then(function(loan){
        if(loan) {
          loan.update(req.body);
        } else {
          res.send(404);
        }
    }).then(function(loan){
        res.redirect("/loans/");
    }).catch(function(error){
        res.send(500, error);
});
});

module.exports = router;
