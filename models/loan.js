'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'A book id is required.'
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'A patron id is required.'
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'A loaned on date is required'
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'A return by date is required'
        }
      }
    },
    timestamps: false,
    returned_on: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  });
  //Class Method
    Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Book, {foreignKey:'book_id'});
    Loan.belongsTo(models.Patron, {foreignKey:'patron_id'});
  };
   
  return Loan;
};