'use strict';
const bcrypt = require('bcryptjs');  
module.exports = {
  up: async (queryInterface, Sequelize) => {
      const password = await bcrypt.hash('++socialmedia++', 10);
      return queryInterface.bulkInsert('users', [{
        name: 'admin',
        email: 'Belo Horizonte',
        city: 'Belo Horizonte',
        password_hash: password,
        active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
