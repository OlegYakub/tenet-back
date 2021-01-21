import connection from '../db/connection';
import {QueryOptions} from 'mysql';

export default class SqlModel {

  async query(query: string, params: string[]) {
    return connection.query(query, params);
  }
}
