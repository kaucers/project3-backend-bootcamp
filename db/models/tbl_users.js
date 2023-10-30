'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.tbl_target_pefs, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.tbl_current_pefs, {
        foreignKey: 'user_id',
      });
      this.belongsToMany(models.tbl_achieves, {
        through: 'tbl_users_achieves',
        foreignKey: 'user_id',
      });
    }
  }
  tbl_users.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      birthday: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'tbl_users',
      underscored: true,
    }
  );
  return tbl_users;
};
