import mysql from 'mysql2/promise';

const mySQLConfig = {
  host: 'localhost',
  user: 'root',
  // password: '12345678',
  database: 'nodemysql'
};

class Connection {
  pool: any;

  init() {
    this.pool = mysql.createPool(mySQLConfig);
    // this.pool.connect(err => {
    //   if (err) {
    //     throw err;
    //   };
    //   console.log("Connected!");
    // });
  }

  async query(query: string, params: string[]) {
    try {
      const r = await this.pool.query(query, params);
      // console.log('r', r[0]);

      return r[0];
    } catch (error) {
      console.log('error', error);

      throw error;
    }
  }
}

export default new Connection();
