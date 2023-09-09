'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_current_pef extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.tbl_users,{
        foreignKey: 'user_id',
        onDelete: 'CASCADE' //link delete with user id
      });
    }
  }
  tbl_current_pef.init({
    sit_up: DataTypes.INTEGER,
    push_up: DataTypes.INTEGER,
    run: DataTypes.INTEGER,
    date: DataTypes.DATE,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_current_pefs',
    underscored: true,
  });
  return tbl_current_pef;
};