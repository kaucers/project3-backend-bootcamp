'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_target_pefs', [{
      sit_up: 50,
      push_up: 50,
      run: 500,
      end_date: new Date('2023-10-30'),
      start_date: new Date('2023-09-07'),
      user_id: 7,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_target_pefs', null, {});
  }
};


//Self-Note: This interfaces directly to postgresql so need to include the actual sql table name
//i.e. with the 's'
