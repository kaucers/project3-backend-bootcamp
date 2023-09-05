'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_target_pef extends Model {
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
  tbl_target_pef.init({
    sit_up: DataTypes.INTEGER,
    push_up: DataTypes.INTEGER,
    run: DataTypes.INTEGER,
    end_date: DataTypes.DATE,
    start_date: DataTypes.DATE,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_target_pefs',
    underscored: true,
  });
  return tbl_target_pef;
};

//Self-Note: It's ok for this to have no "s"; jsexecutable