import { Component,ElementRef,ViewChild,Renderer,PlatformRef } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  title: string = 'maps';
  map: Object;
  directionsService;
  directionsDisplay;
  travelMode:string = 'DRIVING';
  geolocationPosition:Object;
  modeOrigin = null;
 
  

  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('mode') modRef: ElementRef;
  @ViewChild('geolocation') geolocationRef: ElementRef;

  constructor(private renderer: Renderer) {

  }
  

  ngAfterViewInit() {
    
    this.renderer.listen(this.modRef.nativeElement, 'change', ($event) => {
      this.changeModeRoute($event.target.value,this.directionsService,this.directionsDisplay)
    });

    this.renderer.listen(this.geolocationRef.nativeElement, 'click', () => {
      this.geolocation(this.directionsService,this.directionsDisplay)
    });


 }

  ngOnInit() {
      console.log(google)
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      this.directionsService = new google.maps.DirectionsService;
  
      this.map = new google.maps.Map(this.mapRef.nativeElement, {
        center: {lat: 41.3887901, lng: 2.1589899},
        zoom: 8
      });
      this.initMarker();
      this.directionsDisplay.setMap(this.map);

      this.pushControl(this.modRef.nativeElement);
      this.pushControl(this.geolocationRef.nativeElement); 
   
  }

  //Push Contol
  pushControl(element){
    this.map['controls'][google.maps.ControlPosition.TOP_CENTER].push(element);
  }

  //Change Mode Route
  changeModeRoute(event,directionsService,directionsDisplay){
    this.travelMode=event;
    this.calcRoute(directionsService,directionsDisplay);
  }

  initMarker(){
    var marker = new google.maps.Marker({
      position: {lat: 41.3887901, lng: 2.1589899},
      title:"Hello World!"
    });
    marker.setMap(this.map);
  }

  //Calculate Route
  calcRoute(directionsService,directionsDisplay) {

    if(this.modeOrigin == null){
      return;
    }
    var lat = this.geolocationPosition['latitude'];
    var lng = this.geolocationPosition['longitude'];

    var request = {
        origin: new google.maps.LatLng(lat,lng),
        destination: new google.maps.LatLng(41.3887901, 2.1589899),
        travelMode: google.maps.TravelMode[this.travelMode]
    };
    directionsService.route(request, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      }
    });
  }

  geolocation(directionsService,directionsDisplay){

    if(typeof this.geolocationPosition !== 'undefined'){
      this.modeOrigin = 1;
      this.calcRoute(directionsService,directionsDisplay) 
    }else if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
          position => {
              this.geolocationPosition = position.coords;
              this.modeOrigin = 1;
              this.calcRoute(directionsService,directionsDisplay) 
          },
          error => {
              switch (error.code) {
                  case 1:
                      console.log('Permission Denied');
                      break;
                  case 2:
                      console.log('Position Unavailable');
                      break;
                  case 3:
                      console.log('Timeout');
                      break;
              }
          }
      );
    }
  };


}
