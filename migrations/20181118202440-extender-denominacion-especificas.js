'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('especificas', 'denominacion', {
      type: Sequelize.STRING(1000)
    }, {
      timestamps: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return true;
  }
};