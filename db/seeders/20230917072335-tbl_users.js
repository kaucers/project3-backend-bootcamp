'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_users', [
      {
        first_name: 'Test',
        last_name: 'Lit',
        email: 'testlit@outlook.com',
        birthday: '10/15/1992',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_users', null, {});
  },
};
