'use strict';

var express = require('express');
var router = express.Router();

var Book = require('../models').Book;
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;

// Get all books
router.get('/', function(req, res, next) {
    Book.findAndCountAll().then(function(results) {
        res.render('all_books', {
        title: 'Books',
        books: results.rows
        });
})
});

// Get book detail
router.get("/details/:id", function(req, res, next){
    Book.findById(req.params.id).then(function(book){
      if(book){
        res.render('book_detail', {book:book, title: book.title});  
      } else {
        res.send(404);
      }
    })
  });
  
module.exports = router;