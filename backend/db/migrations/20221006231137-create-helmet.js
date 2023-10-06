'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Helmets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trtc_id: {
        type: Sequelize.STRING
      },
      device_id: {
        type: Sequelize.STRING
      },
      ip_address: {
        type: Sequelize.STRING
      },
      location_lat: {
        type: Sequelize.FLOAT
      },
      location_lng: {
        type: Sequelize.FLOAT
      },
      is_online: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Helmets');
  }
};