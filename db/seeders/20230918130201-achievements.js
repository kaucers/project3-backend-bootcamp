'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_achieves', 
    [
      {
        achievement: "speedster", //lower than 10min
        date : new Date('2023-09-30'),
        created_at: new Date(),
        updated_at: new Date()
    },
    {
      achievement: "sit-up machine", //at least 50 sit-ups
      date : new Date('2023-09-30'),
      created_at: new Date(),
      updated_at: new Date()
  },
    {
      achievement: "push-up powerhouse", //bat least 50 push-ups
      date : new Date('2023-09-30'),
      created_at: new Date(),
      updated_at: new Date()
  },
    {
      achievement: "discipline maestro", //at least 5 consecutive entry streek
      date : new Date('2023-09-30'),
      created_at: new Date(),
      updated_at: new Date()
  },
    {
      achievement: "rocketeer", //best improved points
      date : new Date('2023-09-30'),
      created_at: new Date(),
      updated_at: new Date()
  }
  
  ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_achieves', null, {});
  }
};


//Self-Note: This interfaces directly to postgresql so need to include the actual sql table name
//i.e. with the 's'