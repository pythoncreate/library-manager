 'use strict';

var express = require('express');
var router = express.Router();

const { Sequelize, Loan, Book, Patron } = require('../models');


// Get all books
router.get('/', function(req, res, next) {
    Book.findAndCountAll().then(function(results) {
        res.render('all_books', {
        title: 'Books',
        books: results.rows
        });
})
});

// Get book detail + loans
router.get("/details/:id", (req, res)=> {
     const book = Book.findById(req.params.id);
     const loans = Loan.findAll({where: {book_id: req.params.id}, include: [{ model: Patron}, {model: Book}]});

     Promise.all([book, loans]).then(function(data) {

     res.render('book_detail', {book: data[0], loans: data[1]});
  });
});

// Get overdue books
router.get("/overdue",(request, response) => {
    Loan.findAll({
        include: [{ model: Loan, model: Patron }],
        where: {
          return_by: { $lt: new Date() },
          returned_on: null
        }
    })
    .then(result => {
        response.render('overdue_books', {overdue_books: result, title:"Overdue Books"})
    });
    });

  
module.exports = router;