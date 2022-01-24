import { AllowNull, AutoIncrement, BelongsTo, Column, Max, Min, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { FullRegistries } from './full_registries.model';

@Table({
  modelName:       'tbl_dates',
  tableName:       'tbl_dates',
  underscored:     true,
  freezeTableName: true,
  timestamps:      false
})
export class Dates extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Min(1)
  @Max(3000)
  @AllowNull(false)
  @Column
  year: number;
  
  @Min(1)
  @Max(12)
  @AllowNull(false)
  @Column
  month: number;

  @Min(1)
  @Max(31)
  @AllowNull(false)
  @Column
  day: number;

  @AllowNull(false)
  @BelongsTo(() => FullRegistries, {
    foreignKey: 'fk_full_registry_id',
    as:         'FullRegistry',
    onUpdate:   'CASCADE',
    onDelete:   'CASCADE',
  })
  @Column
  fk_full_registry_id: string;
}
