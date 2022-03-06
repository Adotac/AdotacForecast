import { openWeather } from "../weatherService/openWeather";

export class WeatherData {
    public cityName:string;
    public description:string;
    public currTemp:number;
    public icon:string;

    public wind:number;
    public clouds:number;

    constructor(
        cityName:string,
        desc:string,
        cTemp:number,
        icon:string,

        wind:number,
        clouds:number,
    ){
        this.cityName = cityName;
        this.description = desc;
        this.currTemp = cTemp-272.15;
        this.icon = icon;   

        this.wind = wind;
        this.clouds = clouds;
    }

    log(){
        console.log(this.toJSON());
    }

    toJSON(){
        return {
            cityName: this.cityName,
            description: this.description,
            currTemp: this.currTemp,
            icon: this.icon,

            wind:this.wind,
            clouds:this.clouds,
        };
    }

    static fromJSON(body:any, geo:any): WeatherData | null {
        try{
            var temp = new WeatherData(geo.name, 
                body.current.weather[0].description,
                body.current.temp,
                body.current.weather[0].icon,
                body.current.wind_speed,
                body.current.clouds,);
            console.log(`${temp} is instanced` )
            return temp;
        }
        catch(e){
            console.log("weatherData object error");
            return null;
        }
    }
    
}

export class HourlyData{
    public dt: any;
    public hrs: any;
    public temp: number;
    public clouds: number;

    public description: string;
    public icon: string;
    
    constructor(
        dt:string,
        temp:number,
        clouds: number,
        desc: string,
        icon: string,

    ){

        this.dt = this.convertUnixTime(parseInt(dt));
        this.hrs = this.convertUnixTime(parseInt(dt), true);
        this.temp = temp-272.15;
        this.clouds = clouds;
        this.description = desc;

        this.icon = this.getIcon(icon);

    }
    
    getIcon(icon:string):string{
        return openWeather.icons + icon + "@4x.png";
    }
    
    convertUnixTime(unixTimestamp: number, hr?:boolean): string | number{  
        // convert to milliseconds
        // and then create a new Date object
        let dateObj = new Date(unixTimestamp * 1000);

        // Get hours from the timestamp
        let hours = dateObj.getUTCHours();

        // Get minutes part from the timestamp
        let minutes = dateObj.getUTCMinutes();

        if(hr)
            return hours;
        else
            return hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0');
    }

    static fromJSON(hBody:any): HourlyData | null{
        try{
            var temp = new HourlyData(
                hBody.dt,
                hBody.temp,
                hBody.clouds,
                hBody.weather[0].description,
                hBody.weather[0].icon
            );

            console.log("hourly data generated");
            return temp;
        }
        catch(e){
            console.log("hourlyData object error");
            return null;
        }
    }
}