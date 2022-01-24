import { Injectable, Logger }  from '@nestjs/common';
import { Cron }        from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';

import axios           from 'axios';
import { load }        from 'cheerio';
import { Sequelize }   from 'sequelize-typescript';

import { ITides } from './interfaces/tides.interface';

import { Dates }          from 'src/models/dates.model';
import { FullRegistries } from 'src/models/full_registries.model';
import { Sun }            from 'src/models/sun.model';
import { Tides }            from 'src/models/tides.model';

@Injectable()
export class TabuaDeMareService {
  private          url = 'https://tabuademares.com/br/ceara/fortaleza';
  private readonly logger = new Logger(TabuaDeMareService.name);

  constructor(
    private sequelize: Sequelize,
    @InjectModel(Dates) private dates: typeof Dates,
    @InjectModel(FullRegistries) private fullRegistries: typeof FullRegistries,
    @InjectModel(Sun) private sun: typeof Sun,
    @InjectModel(Tides) private tides: typeof Tides
  ){}
  
  cleanReturnFromCherio(value: string[]){
    let newValue = new Array();
    
    for(let i in value){
      let aux = JSON.stringify(value[i]).replace(/\\t/g, '');
  
      if(!(aux.length === 2)) {
        newValue.push(aux.replace(/\"/g, '').trim());
      }
    }
  
    return newValue;
  }
  separateHourAndMetersInFour(value: string[]){
    let rowAux           = new Array();
    let rowAux2          = new Array();
    let rowAuxTestIsTrue = false;
  
    for(let i = 0; i < value.length; i++){
      rowAux.push(value[i].replace(' m', 'm'));
  
      let rowAuxTest   = rowAux[4] > '17:45' && rowAux.length % 6 === 0;
      rowAuxTestIsTrue = rowAuxTestIsTrue && rowAux.length === 6 ? !rowAuxTestIsTrue : rowAuxTestIsTrue;
  
      if(((rowAux.length === 8 || ((i + 1) % 8 === 0 && (rowAux.length !== 2 && rowAux.length !== 4 && rowAux[4] > '17:45'))) && i !== 0 && !rowAuxTestIsTrue) || rowAuxTest){
        rowAuxTestIsTrue = rowAux.length === 6 ? true : false;
        rowAux2.push(rowAux);
        rowAux = [];
      }
    }
  
    return rowAux2;
  }

  async execute(): Promise<ITides[]>{
    try{
      const { data: resultTabuaDeMare } = await axios({ method: 'GET', url: this.url });
      const $                           = load(resultTabuaDeMare);

      let result = [];

      $("#tabla_mareas").each((_, elem) => {
        try{
          let day     = ($(elem).find('div[class="tabla_mareas_dia_numero"]').text()).split('\n');
          let tides   = ($(elem).find('td[class="tabla_mareas_marea tabla_mareas_marea_border_bottom"]').text()).split('\n');
          let sunrise = ($(elem).find('div[class="tabla_mareas_salida_puesta_sol_salida"]').text()).split('\n');
          let sunset  = ($(elem).find('div[class="tabla_mareas_salida_puesta_sol_puesta"]').text()).split('\n');

          day     = this.cleanReturnFromCherio(day);
          tides   = this.cleanReturnFromCherio(tides);
          tides   = this.separateHourAndMetersInFour(tides);
          sunrise = this.cleanReturnFromCherio(sunrise);
          sunset  = this.cleanReturnFromCherio(sunset);

          for(let i in day){
            result.push({ 
              year:    (new Date().getFullYear()),
              month:   (new Date().getMonth() + 1),
              day:     parseInt(day[i]),
              tide:    tides[i],
              sunrise: sunrise[i],
              sunset:  sunset[i]
            });
          }
        }catch(err){
          console.log(err);
        }
      });

      return result;
    }catch(err){
      throw new Error(`Failed on web scraping ${this.url}\n${err}`);
    }
  }

  @Cron('0 0 0 1 * *')
  async load(): Promise<any>{
    const tide: any = await this.execute();
    
    try{
      this.logger.log('Starting load tides on database');
      await this.sequelize.transaction(async t => {
        const transactionHost = { transaction: t };
        const { id: fk_full_registry_id } = await this.fullRegistries.create({ source: 'Tabua de Maré' }, transactionHost);
  
        for(let i in tide){
          await this.dates.create({
            year:  tide[i].year,
            month: tide[i].month,
            day:   tide[i].day,
            fk_full_registry_id
          }, transactionHost);
  
          await this.sun.create({
          sunrise: tide[i].sunrise,
          sunset:  tide[i].sunset,
          fk_full_registry_id
          }, transactionHost);
  
          await this.tides.create({
          first_tide_hour: tide[i].tide[0],
          first_tide:      tide[i].tide[1],
  
          second_tide_hour: tide[i].tide[2],
          second_tide:      tide[i].tide[3],
  
          third_tide_hour: tide[i].tide[4],
          third_tide:      tide[i].tide[5],
  
          forth_tide_hour: tide[i].tide[6] ? tide[i].tide[6] : null,
          forth_tide:      tide[i].tide[7] ? tide[i].tide[7] : null,
  
          fk_full_registry_id
          }, transactionHost);
        }
      });

      this.logger.log('Successful load tides on database');
    }catch(err){
      this.logger.error('Failed on load tides', err.message);
    }
  }
}
