'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.Company, {foreignKey: "company_id"});
      Project.belongsTo(models.User, { foreignKey: "owner_user_id", as: "user"});
      Project.hasMany(models.Helmet, {foreignKey: "project_id"});
    }
  }
  Project.init({
    title: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    owner_user_id: DataTypes.INTEGER,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};