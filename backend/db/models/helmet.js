'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Helmet extends Model {
    static associate(models) {
      Helmet.belongsTo(models.Project, {foreignKey: "project_id"});
      Helmet.belongsTo(models.Company, {foreignKey: "company_id"});
    }
  }
  Helmet.init({
    trtc_id: DataTypes.STRING,
    device_id: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    location_lat: DataTypes.FLOAT,
    location_lng: DataTypes.FLOAT,
    is_online: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    helmet_number: DataTypes.STRING,
    society: DataTypes.STRING,
    email: DataTypes.STRING,
    team: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Helmet',
  });
  return Helmet;
};