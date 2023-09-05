'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_users', [{
        first_name: 'John',
        last_name: 'Doe',
        email: 'demo@demo.com',
        birthday: new Date('1990-01-15'), 
        created_at: new Date(),
        updated_at: new Date()
      }], {});
  },
down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_users', null, {});
  }
};