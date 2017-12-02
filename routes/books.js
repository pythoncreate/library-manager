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

/* POST update book. */
router.put("/details/:id", function(req, res, next){
  Book.findById(req.params.id).then(function(book){
    if(book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(book){
    res.redirect("/books/");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var book = Book.build(req.body);
        book.id = req.params.id;
        res.render("books/details/" + book.id, {book: book, errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

// Get overdue books
router.get("/overdue",(request, response) => {
    Book.findAll({
        include: [{
        model: Loan,
        where: {return_by: { $lt: new Date() }, returned_on: null}
        }],
    })
    .then(result => {
        response.render('overdue_books', {overdue_books: result, title:"Overdue Books"})
    });
    });

// Get checked out books
router.get("/checked",(request, response) => {
    Book.findAll({
        include: [{
        model: Loan,
        where: {returned_on: null}
        }],
    })
    .then(result => {
        response.render('checked_books', {checked_books: result, title:"Checked Books"})
    });
    });

/* Create a new book form. */
router.get('/new', function(req, res, next) {
  res.render("new_book", {book: {}});
});

/* POST create book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book) {
    res.redirect("/books/details/" + book.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("new_book", {book: Book.build(req.body), errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

module.exports = router;