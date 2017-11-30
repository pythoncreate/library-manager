'use strict';

var express = require('express');
var router = express.Router();

const { Sequelize, Loan, Book, Patron } = require('../models');

router.get('/', (request, response) => {
    let options = {include: [{ model: Book }, { model: Patron }] };
  Loan.findAll(options)
    .then(loans => {
      response.render('all_loans',{
      title: 'Loans',
      loans
    })
    .catch(err => {
      console.log(err);
      response.sendStatus(500);
      })
    });
});

module.exports = router;
