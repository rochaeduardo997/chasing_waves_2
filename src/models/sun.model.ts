import { AllowNull, AutoIncrement, BelongsTo, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { FullRegistries } from './full_registries.model';

@Table({
  modelName:       'tbl_sun',
  tableName:       'tbl_sun',
  underscored:     true,
  freezeTableName: true,
  timestamps:      false
})
export class Sun extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;
  
  @AllowNull(false)
  @Column
  sunrise: string;

  @AllowNull(false)
  @Column
  sunset: string;

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
