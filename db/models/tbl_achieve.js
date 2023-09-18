'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_achieve extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.tbl_users,{
        through: "tbl_users_achieves",
        foreignKey: 'achievements_id',
      });
    }
  }
  tbl_achieve.init({
    achievement: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'tbl_achieves',
    underscored: true,
  });
  return tbl_achieve;
};