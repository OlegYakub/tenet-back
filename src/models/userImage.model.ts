import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { User } from "./user.model";
import { Image } from "./image.model";

@Table({ tableName: 'user_image', timestamps: false })
export class UserImage extends Model<UserImage> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    user_id: number;

    @ForeignKey(() => Image)
    @Column({ type: DataType.INTEGER })
    image_id: number;
}