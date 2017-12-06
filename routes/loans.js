'use strict';

var express = require('express');
var router = express.Router();
var moment = require('moment');

var today = new Date();
var formattedToday = moment(today).format('YYYY-MM-DD');
var todayAddSeven = moment(formattedToday).add(7, 'days').format('YYYY-MM-DD');

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

   Promise.all([books, patrons]).then(function(data) {

   res.render('new_loan', {books: data[0], patrons: data[1], formattedToday, todayAddSeven});
});
})

/* POST a NEW LOAN*/
router.post('/new', function(req, res, next) {

  Loan.create(req.body)
    .then(function() {
      res.redirect('/loans');
    })
    .catch(function(error) {
      const books = Book.findAll({
        order: [
          ['title', 'ASC']
        ]
    });

  const patrons = Patron.findAll({
    order: [
      ['first_name', 'ASC'],
      ['last_name', 'ASC']
    ]
  });

  Promise.all([books, patrons])
    .then(function(values) {
      res.render('new_loan', {books: values[0], patrons: values[1], formattedToday, todayAddSeven, 
        formattedToday: req.body.loaned_on, todayAddSeven: req.body.return_by, errors: error.errors, });
    })
  });
})

/* GET Return Form*/
router.get('/:id/return', function(req,res) {
    Loan.findAll({where: {id: req.params.id}, include: [{ model: Patron}, {model: Book}]})
    .then(loans => {
      res.render('return_book', { loan:loans[0], patron:loans[1], book:loans[2], formattedToday});

    })
    .catch(err => {
      console.log(err);
      response.sendStatus(500);
    });
});

/* PUT Return Form*/
router.post('/:id/return', (req, res, next) => {
    
    let error = [];
    let returned_on = req.body.returned_on;
  
    if ((!returned_on) || (returned_on.match (/[a-z]/i)) || (returned_on < formattedToday)) {
      error.push('Please enter a valid return date!');
      Loan.findAll({
        where: [{
          id : req.params.id
        }],
        include: [
          {model: Patron},
          {model: Book}
        ]
      }).then(function(loans) {
        res.render('return_book', {loan: loans[0], patron: loans[1], book: loans[2], formattedToday, errors: error});
      });
    } 
    else { 
      Loan.update(req.body, {
        where: [{
          id: req.params.id
        }]
      }).then(function() {
        res.redirect('/loans');
      });
    }
  })
  


module.exports = router;
