'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Company, {foreignKey: "company_id"});
      User.hasMany(models.Project, {foreignKey: "owner_user_id"});
    }
  }
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    privilege: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    location_lat: DataTypes.FLOAT,
    location_lng: DataTypes.FLOAT,
    location_updated_time: DataTypes.DATE,
    company_code: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};