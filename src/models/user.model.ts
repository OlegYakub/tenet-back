import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserImage } from "./userImage.model";
import { Image } from "./image.model";

interface UserCreationAttributes {
  email: string,
  password: string,
  name: string,
  age?: number,
}

@Table({
  tableName: 'Users',
  scopes: {
    withoutPassword: {
      attributes: { exclude: ['password'] },
    }
  }
})
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER })
  age: number;

  @BelongsToMany(() => Image, () => UserImage)
  images: Image[]
}