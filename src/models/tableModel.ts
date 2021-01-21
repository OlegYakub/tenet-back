import SqlModel from './sqlModel';

export default class TableModel extends SqlModel {
  tableName: string;

  constructor(tableName: string) {
    super();
    this.tableName = tableName;
  }


}
