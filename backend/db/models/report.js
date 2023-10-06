'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
    }
  }
  Report.init({
    name: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    date: DataTypes.DATE,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};