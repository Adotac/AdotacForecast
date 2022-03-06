import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { WeatherData, HourlyData } from '../model/weatherData.model'
import { CrudReturn } from '../model/crud-return';
import { ApiWeatherService } from '../weatherService/api-weather.service';
import { iso31661 } from 'iso-3166';
import { openWeather, unixTime} from '../weatherService/openWeather';
import { geoData } from '../model/geoData.model';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss',]
})
export class FrontPageComponent implements OnInit {

  dateTemp = new Date();
  current_WeatherData:any;
  hr_WeatherData:Array<HourlyData> = [];
  current_GeoData: any;
  userPos:any = {};
  

  constructor(private router: Router, 
    private api: HttpClient,
    private apiW: ApiWeatherService,
  ) {
  }

  geoForm: FormGroup = new FormGroup({
    geoSearch: new FormControl('', Validators.required),
    selectedCode: new FormControl(),
  });
  
  cCode = iso31661;
  ngOnInit(): void {
    console.log(this.cCode);
    // sort ISO data by country name
    this.cCode.sort(function(a, b){
      if(a.name > b.name) return 1;
      else return -1
    });
    //------------//
    //----- user current location ------//
    this.getPosition().then(pos=>{
      this.userPos.lat = pos.lat;
      this.userPos.lon = pos.lng;
      //console.log(`Positon: ${pos.lng} ${pos.lat}`);

      this.get_initialPosData();
    });
    
  }

  async onSearch(): Promise<CrudReturn>{
    console.log("SEARCH PRESSEDDDD");
    try{
      console.log(this.geoForm.value['selectedCode']);
      var x = (await this.apiW.getGeoData(this.geoForm.value['geoSearch'], this.geoForm.value['selectedCode']));
      var y = (await this.apiW.LoadForecastWeather(x.data.lat, x.data.lon));
      console.log(y);
      if(y.success) return y;
      else{
        console.log('Bad request, Please try again...');
        throw Error;
      }
    }
    catch(e){
      console.log(e);
      return {success: false, data: e}
    }
  }

  async displayForecast(body?:CrudReturn){
    var cF:any;
    if(body != null) cF = body;
    else cF = await this.onSearch(); 

    try{
      if(cF.success){
        this.hr_WeatherData = [];
        let geoTemp = await this.apiW.reverse_getGeoData(cF.data.lat, cF.data.lon);
        this.current_GeoData = geoData.fromJSON(geoTemp.data);

        
        for(let i = 0; i < cF.data.hourly.length; i++){
          let x = HourlyData.fromJSON(cF.data.hourly[i]);
          let ctrMax = 0;
          
          if (x != null){
            
            if (x.hrs > this.dateTemp.getHours() && ctrMax < 4){ 
              //console.log(`${dateTemp.getHours()} - ${x.hrs}`);
              this.hr_WeatherData.push(x);
              ctrMax++;
            }
          }  
          else
            throw "hourly error";
        }

        
        console.log(this.hr_WeatherData);
        this.current_WeatherData = WeatherData.fromJSON(cF.data, this.current_GeoData);
        console.log("forecast updated!!");

        this.current_WeatherData.icon = this.getIcon(this.current_WeatherData.icon);
        console.log(this.current_WeatherData.toJSON());
        // window.location.reload();

        
      }
      else
        throw "forecast error";
      
    }
    catch(e){
      console.log("forecast display ERROR!!" + e);
    }
  }

  async getPosition(): Promise<any>{
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });

  }

  async get_initialPosData(){
    console.log(this.userPos);
    let tempWData = await this.apiW.LoadForecastWeather(
      this.userPos.lat, this.userPos.lon);

    this.displayForecast(tempWData);

  }


  getIcon(icon:string):string{
    return openWeather.icons + icon + "@4x.png";
  }

  checkTemp(temp: number): boolean{
    if(temp < 21) // 21 celsius avg warm in PH
      return true; // it is cold
    else
      return false; // it is hot
  }


}
