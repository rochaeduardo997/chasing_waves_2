import { Module }          from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TabuaDeMareService } from './tabuaDeMare.service';

import { Dates }          from 'src/models/dates.model';
import { FullRegistries } from 'src/models/full_registries.model';
import { Sun }            from 'src/models/sun.model';
import { Tides }          from 'src/models/tides.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ FullRegistries, Dates, Sun, Tides ])
  ],
  controllers: [],
  providers: [TabuaDeMareService],
})
export class TabuaDeMareModule {}
