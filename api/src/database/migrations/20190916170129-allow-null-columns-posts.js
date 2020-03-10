'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return Promise.all([
      queryInterface.changeColumn('posts', 'name', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('posts', 'subtitle', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('posts', 'path', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
