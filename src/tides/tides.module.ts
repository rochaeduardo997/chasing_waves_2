import { Module }          from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TidesController } from './tides.controller';
import { TidesService }    from './tides.service';

import { Dates }          from 'src/models/dates.model';
import { FullRegistries } from 'src/models/full_registries.model';
import { Sun }            from 'src/models/sun.model';
import { Tides }          from 'src/models/tides.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ FullRegistries, Dates, Sun, Tides ])
  ],
  controllers: [TidesController],
  providers: [TidesService],
})
export class TidesModule {}
