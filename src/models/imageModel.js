import { DataTypes } from 'sequelize';
import connection from '../db/connection';

const Image = connection.sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  path: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false
});

export default Image;

