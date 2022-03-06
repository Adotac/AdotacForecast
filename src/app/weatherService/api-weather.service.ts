import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { openWeather } from './openWeather';
import { geoData } from '../model/geoData.model';
import { CrudReturn } from '../model/crud-return';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiWeatherService {

  constructor(private api:HttpClient) { }

  async getGeoData(q:string, countryCode:string): Promise<CrudReturn>{
    try{
      //console.log(countryCode);
      if(q === '' || countryCode == null){
        alert("Please complete the input fields first...");
        throw "No cityName";
      }
        
      else
        var geoTest:any = await this.api.get(openWeather.geoCall + 
          "q=" + q + "," + countryCode + 
          "&limit=5&appid=" + openWeather.appId).toPromise();

        //console.log(geoTest);
        var i: number = 0;
        for(i;i<5;i++){
          //console.log(i);
          if(countryCode.toLocaleUpperCase() === geoTest[i].country){
            
            break;
          }
        }
        

      return {success:true, data:geoTest[i]};
    }
    catch(e){
      console.log(e);
      return {success:false, data: e}
    }
  }

  async reverse_getGeoData(lat:number, lon:number): Promise<CrudReturn>{
    try{
      var geoTest:any = await this.api.get(openWeather.re_geoCall + 
        "lat=" + lat + "&lon=" + lon + 
        "&limit=5&appid=" + openWeather.appId).toPromise();

        //console.log(geoTest);

      return {success:true, data:geoTest[0]};
    }
    catch(e){
      console.log(e);
      return {success:false, data: e}
    }
  }

  async LoadForecastWeather(lat:number, lon:number): Promise<CrudReturn>{
    try{
      var currTest:any = await this.api.get(openWeather.forecastCall +
        "lat=" + lat + "&lon=" + lon + 
        "&exclude=daily,minutely,alerts" +
        "&appid=" + openWeather.appId).toPromise();

        //console.log(currTest);
        return {success:true, data:currTest};
    }
    catch(e){
      console.log(e);
      return {success:false, data:e};
    }

  }


  
}
