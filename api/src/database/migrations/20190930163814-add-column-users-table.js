'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'verification_token', {
        type: Sequelize.STRING
       }),
      queryInterface.addColumn('users', 'email_verified_at', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    ])
   return 
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'verification_token'),
      queryInterface.removeColumn('users', 'email_verified_at'),
    ]);
  }
};
