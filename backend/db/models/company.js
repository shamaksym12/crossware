'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.User, {foreignKey: "company_id"});
      Company.hasMany(models.Project, {foreignKey: "company_id", as: "projects"});
      Company.hasMany(models.Helmet, {foreignKey: "company_id"});
    }
  }
  Company.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};