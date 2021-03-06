'use strict';
module.exports = (sequelize, DataTypes) => {
  const genericas = sequelize.define('genericas', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    numero_generica: {
      type: DataTypes.STRING,
      allowNull: false
    },    
    partida_presupuestaria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "partidas_presupuestarias",
        key: "id"
      }
    },
    denominacion: {
        type: DataTypes.STRING,
        allowNull: false
      },   
    habilitada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
  genericas.associate = function(models) {
    genericas.belongsTo(models.partidas_presupuestarias, {
      foreignKey: 'partida_presupuestaria_id',
      as: 'partida_presupuestaria'
    }) 
    genericas.hasMany(models.especificas, {
      foreignKey: 'generica_id',
      as: 'especificas',
    })  };
  return genericas;
};