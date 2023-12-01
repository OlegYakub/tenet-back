import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from "./user.model";

interface FeedCreationAttributes {
    title: string
}

@Table({ tableName: 'feed' })
export class Feed extends Model<Feed, FeedCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    author_id: number;

    @BelongsTo(() => User)
    owner: User;
}
