import { Sequelize } from 'sequelize-typescript';
import { User } from "../models/user.model";
import { Feed } from "../models/feed.model";
import { Image } from "../models/image.model";
import { UserImage } from "../models/userImage.model";

const mySQLConfig = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'nodemysql'
  // database: 'test1'
};

class Connection {
  sequelize: Sequelize;
  constructor() {
    this.sequelize = new Sequelize({
      database: mySQLConfig.database,
      dialect: 'mysql',
      password: '',
      username: mySQLConfig.user,
    })

  }

  async checkConnection() {
    try {
      // TODO add models in more generic way
      this.sequelize.addModels([User, Image, Feed, UserImage]);
      // this.sequelize.addModels([path1]);
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

