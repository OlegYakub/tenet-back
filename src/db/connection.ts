import { Sequelize } from 'sequelize-typescript';
import { User } from "../models/user.model";
import { Feed } from "../models/feed.model";
import { Image } from "../models/image.model";
import { UserImage } from "../models/userImage.model";

console.log('MYSQL_DB', process.env.MYSQL_DB);
console.log('MYSQL_USER', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD', process.env.MYSQL_PASSWORD);
console.log('MYSQL_HOST 12', process.env.MYSQL_HOST);

class Connection {
  sequelize: Sequelize;
  constructor() {
    this.sequelize = new Sequelize({
      database: process.env.MYSQL_DB,
      dialect: 'mysql',
      password: process.env.MYSQL_PASSWORD,
      username: process.env.MYSQL_USER,
      host: process.env.MYSQL_HOST
      // host: '172.18.0.2'
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

