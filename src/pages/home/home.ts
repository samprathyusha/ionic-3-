import { Component, } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import {BarcodeScanner,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { GeocoderProvider } from '../../providers/geocoder/geocoder';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { Uid } from '@ionic-native/uid';
import {Http,Headers} from '@angular/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  Barcode:string;
  options:BarcodeScannerOptions;
  lat:any;
  long:any;
   /*** Define a FormGroup object for the forwardGeocoding form */
   public form: FormGroup;
    /** * Define a FormGroup object for the reverseGeocoding form */
   public geoForm : FormGroup;
   
   /** * Define a boolean property to reference whether geocoding has been * performed or not */
   public geocoded : boolean;
    /** * Define a string value to handle returned geocoding results */
   public results : string;
   
 /** * Define the initial text value for the form switching button in the* HTML template */
   public filter : string      = 'Search by Coordinates';
      /*** Define a boolean property to determine that the forwardGeocoding * form is displayed first*/
   public displayForward : boolean= true;
      /** * Define a boolean property to determine that the reverseGeocoding* form is not to be displayed first*/
   public displayReverse: boolean = false;

   device_id: any;
   location:any;

  constructor(private barcode:BarcodeScanner,public uid:Uid,public http:Http,public navCtrl: NavController,public Androidpermissions:AndroidPermissions,  private _FB : FormBuilder, private _PLATFORM : Platform,public geoloction:Geolocation, public geocoder:GeocoderProvider) {
 this.callingapi()
   this.getIMEI();

    this.geoloction.getCurrentPosition().then(pos=>{
      this.lat=pos.coords.latitude;
      this.long=pos.coords.longitude;
    })
  
    
  
    // Define the validation rules for handling the
 // address submission from the forward geocoding form
      this.form       = _FB.group({
        'keyword'        : ['', Validators.required]
     });
     // Define the validation rules for handling the
      // latitude/longitude submissions from the reverse
      // geocoding form
      this.geoForm    = _FB.group({
        'latitude'        : ['', Validators.required],
        'longitude'       : ['', Validators.required]
     });
  }

   /**** Determine whether the forwardGeocoding or* reverseGeocoding form will be displayed*
     * @public
     * @method filterForm
     * @return {none}
     *
     */

    filterForm()
    {
       if(this.displayForward)
       {
          this.filter      		 = 'Search by keyword';
          this.displayReverse     = true;
          this.displayForward     = false;
       }
       else
       {

          this.filter             = 'Search by Co-ordinates';
          this.displayReverse     = false;
          this.displayForward     = true;
          alert(this.lat+""+this.long);
           let data={
            latitude:this.lat,
            longitude:this.long
          }

          
          this.performReverseGeocoding(data)
       }
    }

// how to excute third party api swiggy app
callingapi(){
   this.http.get(' api calling').subscribe(data=>{
      var information= data;
   console.log(JSON.parse(data._body).feeds);
   
   
      
   })
}







    /**** Retrieve latitude/longitude coordinate values from HTML form,* pass these into the reverseGeocode method of the Geocoder service
     * and handle the results accordingly
     *
     * @public
     * @method performReverseGeocoding
     * @return {none}
     *
     */
    performReverseGeocoding(val)
    {
      alert(JSON.stringify(val));
      
       this._PLATFORM.ready()
       .then((data : any) =>
       {

         
          let latitude     : any = parseFloat(this.geoForm.controls["latitude"].value),
              longitude    : any = parseFloat(this.geoForm.controls["longitude"].value);
              
 
          this.geocoder.reverseGeocode(latitude, longitude)
          .then((data : any) =>
          {
            
             this.geocoded      = true;
             this.results       = data;
 
          })
          .catch((error : any)=>
          {
             this.geocoded      = true;
             this.results       = error.message;
          });
       });
    }

    
   /**
     *
     * Retrieve address location submitted from HTML form,
     * pass these into the forwardGeocode method of the Geocoder service
     * and handle returned latitude/longitude coordinate values accordingly
     *
     * @public
     * @method performForwardGeocoding
     * @return {none}
     *
     */
   performForwardGeocoding(val)
   {
      this._PLATFORM.ready()
      .then((data : any) =>
      {
         let keyword : string = this.form.controls["keyword"].value;
         this.geocoder.forwardGeocode(keyword)
         .then((data : any) =>
         {
            this.geocoded      = true;
            this.results       = data;

         })
         .catch((error : any)=>
         {
            this.geocoded      = true;
            this.results       = error.message;
         });
      });
   }


  scanBarcode(){
    const results=this.barcode.scan();
    alert(results);
    let barcode=JSON.stringify(results);
    alert(barcode);
  }

  getlocation(){
    this.geoloction.getCurrentPosition().then(pos=>{
      this.lat=pos.coords.latitude;
      this.long=pos.coords.longitude;
    })

  }

  async getIMEI() {
   
   const {hasPermission} = await this.Androidpermissions.checkPermission(this.Androidpermissions.PERMISSION.READ_PHONE_STATE);
   if (!hasPermission) {
      const result = await this.Androidpermissions.requestPermission(this.Androidpermissions.PERMISSION.READ_PHONE_STATE);
      alert(JSON.stringify(result));
      if (!result.hasPermission) {
         throw new Error ('Permissions required');
     }

}
alert(JSON.stringify(this.uid.UUID));
this.device_id = this.uid.IMEI;
alert(this.device_id);
   //  return this.uid.IMEI;

  }

}
