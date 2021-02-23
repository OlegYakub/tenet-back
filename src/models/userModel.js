import { DataTypes } from 'sequelize';
import connection from '../db/connection';

const User = connection.sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isAuthorized: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  imageId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  scopes: {
    withoutPassword: {
      attributes: { exclude: ['password'] },
    }
  }
});

export default User;
