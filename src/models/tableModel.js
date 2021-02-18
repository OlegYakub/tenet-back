import SqlModel from './sqlModel';

export default class TableModel extends SqlModel {

  constructor(tableName) {
    super();
    this.tableName = tableName;
  }
}
