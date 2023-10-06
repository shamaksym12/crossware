'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        company_id: 1,
        first_name: "SOAT",
        last_name: "Corp",
        email: "soatcorpdev@gmail.com",
        password: "$2b$10$Sd8TV2Hb/pI2sDx.WyFpp.I86ZpK/h3NnnPNdOX8bVjD3o9okzscS",
        phone_number: "000-9999-9999",
        privilege: "user",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        company_id: 1,
        first_name: "jeffson",
        last_name: "wu",
        email: "jeffson@brdrlss.com",
        password: "$2b$10$vqmb0lf3tynbjzwumirusu6q73oiyu7ck6b30ybhehqwlnyqkb.xu",
        phone_number: "07043774394",
        privilege: "user",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        company_id: 1,
        first_name: "秋田谷",
        last_name: "洋人",
        email: "hirotoakitaya@gmail.com",
        password: "$2b$10$LeFJRfTeiqnUP30XRoBeQej1r7QhUw4wUlscGVQ63CC5osp6kadQq",
        phone_number: "aaa",
        privilege: "user",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        company_id: 1,
        first_name: "oono",
        last_name: "arata",
        email: "arataoono@brdrlss.com",
        password: "$2b$10$5vRa/Xg/K0kxHgbAnrIVPuWJiaec98MipbCE8/LIiMXiax3JwI4j6",
        phone_number: "05033959042",
        privilege: "user",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        company_id: 1,
        first_name: "bdls",
        last_name: "inc",
        email: "info@brdrlss.com",
        password: "$2b$10$h77euqyhjcz.red//WZZ3efT5qO2AFtd9DYJH3xr1a8pEg4Vh9w8y",
        phone_number: "+815033959042",
        privilege: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        location_lat: 35.021,
        location_lng: 135.756,
        location_updated_time: new Date(),
      },
      {
        id: 6,
        company_id: 1,
        first_name: "ジョシ",
        last_name: "マニス",
        email: "manish@brdrlss.com",
        password: "$2b$10$taDogUuclznhnHxuAWvd0.3bYDcamcIjds7nXE2P5J5BWsks0Ipna",
        phone_number: "09066001606",
        privilege: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        location_lat: 43.062087,
        location_lng: 141.354404,
        location_updated_time: new Date(),
      },
      {
        id: 7,
        company_id: 1,
        first_name: "msh",
        last_name: "toyama",
        email: "toyama-msh@taisei-bm.co.jp",
        password: "$2b$10$6pjtxq3oayolifmvlk3blefu2g06psibwwm1hvhkiqxnt77.si01i",
        phone_number: "09876543210",
        privilege: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        location_lat: 35.6769883,
        location_lng: 139.7588499,
        location_updated_time: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
