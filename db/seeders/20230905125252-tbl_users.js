'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_users', [
      {
        first_name: 'Maud',
        last_name: 'Gone',
        email: 'maudgone@outlook.com',
        birthday: '1987-01-02',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_users', null, {});
  },
};
