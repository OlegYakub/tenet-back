import { Sequelize } from 'sequelize';

const mySQLConfig = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'nodemysql'
};

class Connection {
  constructor() {
    this.sequelize = new Sequelize(
      mySQLConfig.database,
      mySQLConfig.user,
      '',
      {
        dialect: 'mysql',
      });
  }

  async checkConnection() {
    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync();
      console.log('Connection has been established successfully.');
      console.log('Models: ', this.sequelize.models);

    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}
const connection = new Connection();
export default connection;

