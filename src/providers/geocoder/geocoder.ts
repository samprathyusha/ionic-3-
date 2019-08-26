import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeGeocoder,NativeGeocoderReverseResult,
         NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

/*
  Generated class for the GeocoderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeocoderProvider {

 
  constructor(public http       : Http,
    private _GEOCODE  : NativeGeocoder) {
    console.log('Hello GeocoderProvider Provider');
  }


  
   /**** Perform reverseGeocoding operation and return address details*
     * @public
     * @method reverseGeocode
     * @return {Promise}
     *
     */

    reverseGeocode(lat : number, lng : number) : Promise<any>
    {
      alert("in reverse method");
       return new Promise((resolve, reject) =>
       {
          this._GEOCODE.reverseGeocode(lat, lng)
          .then((result : NativeGeocoderReverseResult[]) =>
          {
            alert(JSON.stringify(result[0]));
             let str : string   = `The reverseGeocode address is ${result[0].subThoroughfare}, ${result[0].thoroughfare},${result[0].subLocality},${result[0].locality},${result[0].subAdministrativeArea},${result[0].administrativeArea}-${result[0].postalCode},${result[0].countryName}`;
             resolve(str);
          })
          .catch((error: any) =>
          {

            alert(error);
             console.log(error);
             reject(error);
          });
       });
    }
 
 /** ** Perform forwardGeocode operation and return latitude/longitude details*
     * @public
     * @method forwardGeocode
     * @return {Promise}
     *
     */ 
    forwardGeocode(keyword : string) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._GEOCODE.forwardGeocode(keyword)
         .then((coordinates : NativeGeocoderForwardResult[]) =>

         {

            let str : string   = `The coordinates are latitude=${coordinates[0].latitude} and longitude=${coordinates[0].longitude}`;
            resolve(str);
         })
         .catch((error: any) =>
         {
            console.log(error);
            reject(error);
         });
      });
   }



}
