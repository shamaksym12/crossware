'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'Users',
          'location_lat',
          {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'Users',
          'location_lng',
          {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
      ),
      queryInterface.addColumn(
          'Users',
          'location_updated_time',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Projects', 'location_lat'),
      queryInterface.removeColumn('Projects', 'location_lng'),
      queryInterface.removeColumn('Projects', 'location_updated_time'),
    ]);
  }
};
