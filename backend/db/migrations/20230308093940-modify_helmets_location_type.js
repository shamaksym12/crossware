'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('Helmets', 'location_lat', {
          type: Sequelize.DECIMAL(11, 8),
          allowNull: true,
      }),
      queryInterface.changeColumn('Helmets', 'location_lng', {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('Helmets', 'location_lat', {
          type: Sequelize.FLOAT,
          allowNull: true,
      }),
      queryInterface.changeColumn('Helmets', 'location_lng', {
        type: Sequelize.FLOAT,
        allowNull: true,
      })
    ])
  }
};
