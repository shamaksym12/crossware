'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      Promise.all([
        queryInterface.addColumn(
          'Helmets',
          'project_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        ),
        queryInterface.addColumn(
          'Helmets',
          'company_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        ),
        queryInterface.addColumn(
          'Projects',
          'company_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        ),
        queryInterface.addColumn(
          'Projects',
          'owner_user_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        ),
        queryInterface.addColumn(
          'Users',
          'company_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        ),
      ]),
      Promise.all([
        queryInterface.addConstraint('Helmets', {
          fields: ['project_id'],
          type: 'foreign key',
          name: 'Helmets_project_id',
          references: {
            table: 'Projects',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        }),
        queryInterface.addConstraint('Helmets', {
          fields: ['company_id'],
          type: 'foreign key',
          name: 'Helmets_company_id',
          references: {
            table: 'Companies',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        }),
        queryInterface.addConstraint('Projects', {
          fields: ['company_id'],
          type: 'foreign key',
          name: 'Projects_company_id',
          references: {
            table: 'Companies',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        }),
        queryInterface.addConstraint('Projects', {
          fields: ['owner_user_id'],
          type: 'foreign key',
          name: 'Projects_owner_user_id',
          references: {
            table: 'Users',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        }),
        queryInterface.addConstraint('Users', {
          fields: ['company_id'],
          type: 'foreign key',
          name: 'Users_company_id',
          references: {
            table: 'Companies',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        }),
      ])
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeConstraint(
          'Users',
          "Users_company_id"
      ),
      queryInterface.removeConstraint(
          'Projects',
          "Projects_company_id"
      ),
      queryInterface.removeConstraint(
          'Projects',
          "Projects_owner_user_id"
      ),
      queryInterface.removeConstraint(
          'Helmets',
          "Helmets_company_id"
      ),
      queryInterface.removeConstraint(
          'Helmets',
          "Helmets_project_id"
      ),
      queryInterface.removeColumn(
        'Helmets',
        'project_id'
      ),
      queryInterface.removeColumn(
        'Helmets',
        'company_id'
      ),
      queryInterface.removeColumn(
        'Projects',
        'company_id'
      ),
      queryInterface.removeColumn(
        'Projects',
        'owner_user_id'
      ),
      queryInterface.removeColumn(
        'Users',
        'company_id',
      )
    ])
  }
};
