'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
    }
  }
  Log.init({
    trtc_id: DataTypes.STRING,
    message: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    location_lat: DataTypes.FLOAT,
    location_lng: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Log',
  });
  return Log;
};