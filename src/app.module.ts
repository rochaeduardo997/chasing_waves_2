import { Module }          from '@nestjs/common';
import { ConfigModule }    from '@nestjs/config';
import { ScheduleModule }  from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';

import { TabuaDeMareModule } from './tabuaDeMare/tabuaDeMare.module';

@Module({
  imports: [
    TabuaDeMareModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect:  process.env.DATABASE_DIALECT,
      host:     process.env.DATABASE_HOST,
      port:     parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,

      autoLoadModels: true,
      synchronize:    true,

      logging: false
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
