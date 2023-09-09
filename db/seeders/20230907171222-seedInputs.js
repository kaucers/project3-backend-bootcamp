'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_current_pefs', 
    [
      {
      sit_up: 30,
      push_up: 20,
      run: 720,
      date: new Date('2023-09-08'),
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sit_up: 30,
      push_up: 25,
      run: 720,
      date: new Date('2023-09-09'),
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      sit_up: 25,
      push_up: 20,
      run: 700,
      date: new Date('2023-09-08'),
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }
  
  ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_current_pefs', null, {});
  }
};


//Self-Note: This interfaces directly to postgresql so need to include the actual sql table name
//i.e. with the 's'
