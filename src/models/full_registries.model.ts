import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { randomUUID }                       from 'crypto';

@Table({
  modelName:       'tbl_full_registries',
  tableName:       'tbl_full_registries',
  underscored:     true,
  freezeTableName: true,
  timestamps:      false
})
export class FullRegistries extends Model {
  @PrimaryKey
  @Column({ defaultValue: randomUUID })
  id: string;

  @Column
  source: string;

  @Column({ defaultValue: true })
  status: boolean;
}
