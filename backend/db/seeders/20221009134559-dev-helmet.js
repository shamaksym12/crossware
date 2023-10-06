'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Helmets', [{
      id: 3,
      company_id: 1,
      project_id: 1,
      trtc_id: "Test Sample",
      device_id: "test",
      ip_address: "::1",
      location_lat: "35.6528",
      location_lng: "139.839",
      name: "test",
      helmet_number: "1234",
      phone_number: "1234",
      society: "test",
      email: "test@test.com",
      team: "test",
      is_online: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Helmets', null, {});
  }
};
