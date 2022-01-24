import { AllowNull, AutoIncrement, BelongsTo, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { FullRegistries } from './full_registries.model';

@Table({
  modelName:       'tbl_tides',
  tableName:       'tbl_tides',
  underscored:     true,
  freezeTableName: true,
  timestamps:      false
})
export class Tides extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;
  
  @AllowNull(false)
  @Column
  first_tide_hour: string

  @AllowNull(false)
  @Column
  first_tide:      string

  @AllowNull(false)
  @Column
  second_tide_hour: string

  @AllowNull(false)
  @Column
  second_tide:      string

  @AllowNull(false)
  @Column
  third_tide_hour: string

  @AllowNull(false)
  @Column
  third_tide:      string

  @AllowNull(true)
  @Column
  fourth_tide_hour: string

  @AllowNull(true)
  @Column
  fourth_tide:      string

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
