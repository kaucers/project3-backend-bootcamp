'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_current_pefs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sit_up: {
        type: Sequelize.INTEGER
      },
      push_up: {
        type: Sequelize.INTEGER
      },
      run: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references:{
          model: 'tbl_users',
          key: 'id',
          as: 'user_id',
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_current_pefs');
  }
};