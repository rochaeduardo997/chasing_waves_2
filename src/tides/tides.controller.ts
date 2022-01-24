import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { InjectModel }                    from '@nestjs/sequelize';
import { raw, Response }                       from 'express';

import { Dates }          from 'src/models/dates.model';
import { FullRegistries } from 'src/models/full_registries.model';
import { Sun }            from 'src/models/sun.model';
import { Tides }          from 'src/models/tides.model';

@Controller()
export class TidesController {
  constructor(
    @InjectModel(Dates) private dates: typeof Dates,
    @InjectModel(FullRegistries) private fullRegistries: typeof FullRegistries,
    @InjectModel(Sun) private sun: typeof Sun,
    @InjectModel(Tides) private tides: typeof Tides
  ){}
  
  @Get()
  @HttpCode(200)
  async findAll(@Res() response: Response): Promise<any> {
    const day   = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year  = new Date().getFullYear();

    const datesResult = await this.dates.findOne({
      where: { day, month, year },
      include: [{
        model: FullRegistries,
        attributes: [ 'source', 'status' ]
      }],
      attributes: { exclude: [ 'id' ]},
      raw: true,
    })

    const tidesResult = await this.tides.findOne({ 
      where: {
        fk_full_registry_id: datesResult.fk_full_registry_id 
      },
      attributes: { exclude: [ 'id', 'fk_full_registry_id' ]},
      raw: true
    });
    const sunResult   = await this.sun.findOne({
      where: {
        fk_full_registry_id: datesResult.fk_full_registry_id 
      },
      attributes: { exclude: [ 'id', 'fk_full_registry_id' ]},
      raw: true
    });
    console.log({ ...datesResult, ...tidesResult, ...sunResult });
    response.json({ status: true, msg: 'foi' });
  }
}
