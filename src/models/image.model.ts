import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserImage } from "./userImage.model";
import { User } from "./user.model";

type ImageCreationAttributes = {
  path: string,
}

@Table({ tableName: 'Images', timestamps: false })
export class Image extends Model<Image, ImageCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @BelongsToMany(() => User, () => UserImage)
  users: User[]
}
