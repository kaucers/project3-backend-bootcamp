"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_users_achieves", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      achievements_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "tbl_achieves",
          key: 'id',
          as: "achievements_id",
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references:{
          model: 'tbl_users',
          key: 'id',
          as: 'user_id',
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,

      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_users_achieves");
  },
};