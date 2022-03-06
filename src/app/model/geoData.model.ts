export class geoData{
    public name:string;
    public latitude:number;
    public longitude:number;
    public country:string; // Country code - iso31661
    

    constructor(
        name:string,
        lat:number,
        lon:number,
        country:string,
    ){
        this.name = name;
        this.latitude = lat;
        this.longitude = lon;
        this.country = country;
    }

    toJSON(){
        return{
            name:this.name,
            latitude:this.latitude,
            longitude:this.longitude,
            country:this.country,
        };
    }

    static fromJSON(body:any): geoData | null{
        try{
            var temp =  new geoData(body.name, body.lat, body.lon, body.country);
            console.log(temp);
            return temp;
        }
        catch(e){
            console.log(e);
            return null;
        }
    }

    log(){
        console.log(this.toJSON());
    }
}