'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('unidades_de_medida', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      habilitado: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      accion_recurrente_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
    }, {
      timestamps: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('unidades_de_medida');
  }
};