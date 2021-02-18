import connection from '../db/connection';

export default class SqlModel {

  async query(query, params) {
    return connection.query(query, params);
  }
}
