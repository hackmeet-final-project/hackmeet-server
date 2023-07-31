'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init({
    name: DataTypes.STRING,
    owner: DataTypes.STRING,
    guest: DataTypes.STRING,
    totalUser: {
      type: DataTypes.INTEGER,
      validate: {
        max: {
          args: [2],
          msg: "Maximum user exceeded"
        }
      }
    },
    winner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};