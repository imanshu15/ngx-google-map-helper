import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Shape, Circle, Polygon, Rectangle, Marker } from './model/shapes.model';
import { OverLay, OverLayOption, MarkerOption} from './model/overlay.model';
import { LatLang } from './model/latlang.model';
import { CustomButton } from './model/custom-button.model';

import iconValues from './assets/icons';
import defaultValues from './model/default-values';
import { NgxGoogleMapHelperService } from './ngx-google-map-helper.service';
declare const google: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-google-map-helper',
  templateUrl: './ngx-google-map-helper.component.html',
  styleUrls: ['./ngx-google-map-helper.component.scss']
})
export class NgxGoogleMapHelperComponent implements OnInit {

 // map style inputs
 @Input() mapHeight = defaultValues.height;
 @Input() mapWidth = defaultValues.width;
 @Input() zoom = defaultValues.zoom;
 @Input() center: LatLang = null;
 @Input() mapType = 'ROADMAP'; // ['ROADMAP', 'SATELLITE', 'HYBRID', 'TERRAIN']
 // drawing control inputs
 @Input() placeMarkerOnClick = false;
 @Input() showControl = true;
 @Input() position = defaultValues.handlerPositions[0]; // TOP_CENTER, BOTTOM_LEFT
 @Input() showModes = defaultValues.drawingModes; // 'marker', 'circle', 'polygon', 'polyline', 'rectangle'
 @Input() locationAccess = false;
 @Input() commonOption: OverLayOption = defaultValues.defaultOverlayValues;
 @Input() circleOption: OverLayOption;
 @Input() polygonOption: OverLayOption;
 @Input() polylineOption: OverLayOption;
 @Input() rectangleOption: OverLayOption;
 @Input() markerOption: MarkerOption = defaultValues.defaultMarkerValues;
 @Input() customButtons = true;
 @Input() onlyCustomButtons = [];
 @Input() googleMapObjects = false;
 @Input() showErrors = true;
 @Input() shapes: Shape[] = [];


 // outputs
 @Output() mapClicked = new EventEmitter();
 @Output() overlayCompleted = new EventEmitter();
 @Output() overlaySelected = new EventEmitter();
 @Output() saveSeleted = new EventEmitter();
 @Output() saveAll = new EventEmitter();

 isWorldView = false;

 allOverlays: any = [];
 selectedShape: any;
 drawingManager: any;

 private map: any;
 private apiKey: string;
 private customButtonsList: CustomButton[] = defaultValues.customButtons;

 constructor(private elementRef: ElementRef, mapService: NgxGoogleMapHelperService) {
  this.apiKey = mapService.getApiKey();
 }

 ngOnInit() {
   console.log(this.shapes);
   if (this.apiKey && this.apiKey !== '') {
    Promise.all([
      this.lazyLoadMap()
    ]).then(value => this.initMap());

    this.initOverlayOptions();
  } else {
    this.showError('google map key required, include in forroot()', null);
  }
 }

 checkValues() {
    if (!this.mapWidth) {
      this.mapWidth = defaultValues.width;
    }
    if (!this.mapHeight) {
      this.mapHeight = defaultValues.height;
    }
    if (!this.zoom) {
      this.zoom = defaultValues.zoom;
    }
    // if (!this.center) {
    //   this.center = defaultValues.center;
    // }
 }

 lazyLoadMap() {
   const promise = new Promise((resolve, reject) => {
   if (typeof google === 'object' && typeof google.maps === 'object') {
       resolve();
   } else {
       const s = document.createElement('script');
       s.setAttribute('id', 'googleMap');
       s.type = 'text/javascript';
       s.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=drawing`;
       this.elementRef.nativeElement.appendChild(s);
     }
   setTimeout(() => {
         resolve();
       }, 1000);
   });
   return promise;
 }

 // if the user has overridden the options
 initOverlayOptions() {
   if (!this.circleOption) {
     this.circleOption = this.commonOption;
   }
   if (!this.polygonOption) {
     this.polygonOption = this.commonOption;
   }
   if (!this.polylineOption) {
     this.polylineOption = this.commonOption;
   }
   if (!this.rectangleOption) {
     this.rectangleOption = this.commonOption;
   }
 }

 // initialize the map with location
 initMap() {
   if (this.locationAccess && navigator) {
     navigator.geolocation.getCurrentPosition(pos => {
       this.center.lng = +pos.coords.longitude;
       this.center.lat = +pos.coords.latitude;
       this.setUpMap(false);
     }, error => {
       this.setUpMap(true);
       this.isWorldView = true;
       this.showError('error while reading location', this.onlyCustomButtons);
     });
   } else {
     this.setUpMap(true);
     this.isWorldView = true;

     if (this.locationAccess) {
       this.showError('please allow location access on browser', this.onlyCustomButtons);
     }
   }
 }

 private setUpWorldView() {

   const allowedBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(85, -180),	// top left corner of map
     new google.maps.LatLng(-85, 180)	// bottom right corner
   );
   const k = 5.0;
   const n = allowedBounds .getNorthEast().lat() - k;
   const e = allowedBounds .getNorthEast().lng() - k;
   const s = allowedBounds .getSouthWest().lat() + k;
   const w = allowedBounds .getSouthWest().lng() + k;
   const neNew = new google.maps.LatLng( n, e );
   const swNew = new google.maps.LatLng( s, w );
   const boundsNew = new google.maps.LatLngBounds( swNew, neNew );
   this.map .fitBounds(boundsNew);
 }

 private setUpMap(isWorldView: boolean) {

    let tempCenter: LatLang;
    if (this.center) {
      tempCenter = this.center;
      this.isWorldView = false;
      isWorldView = false;
    } else {
      tempCenter = defaultValues.center;
    }

    this.map = new google.maps.Map(document.getElementById('map'), {
     center: {
       lat: tempCenter.lat,
       lng: tempCenter.lng
     },
     zoom: this.zoom,
     minZoom: 2,
     mapTypeId: google.maps.MapTypeId[this.mapType]
     ,
     styles: [
       {
         featureType: 'administrative.province',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'administrative.locality',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'administrative.neighborhood',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'administrative.land_parcel',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'landscape',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'landscape.man_made',
         elementType: 'geometry.fill',
         stylers: [
           {
             color: '#e9e5dc'
           }
         ]
       },
       {
         featureType: 'landscape.natural',
         elementType: 'geometry.fill',
         stylers: [
           {
             visibility: 'on'
           },
           {
             color: '#b8cb93'
           }
         ]
       },
       {
         featureType: 'poi',
         elementType: 'all',
         stylers: [
           {
             visibility: 'off'
           }
         ]
       },
       {
         featureType: 'poi.attraction',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.business',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.business',
         elementType: 'geometry.fill',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.government',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.government',
         elementType: 'geometry.fill',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.medical',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.medical',
         elementType: 'geometry.fill',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.park',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.park',
         elementType: 'geometry.fill',
         stylers: [
           {
             color: '#ccdca1'
           }
         ]
       },
       {
         featureType: 'poi.park',
         elementType: 'labels.text.fill',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.place_of_worship',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.school',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'poi.sports_complex',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'road',
         elementType: 'all',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'road',
         elementType: 'geometry.fill',
         stylers: [
           {
             hue: '#ff0000'
           },
           {
             saturation: -100
           },
           {
             lightness: 99
           }
         ]
       },
       {
         featureType: 'road',
         elementType: 'geometry.stroke',
         stylers: [
           {
             color: '#808080'
           },
           {
             lightness: 54
           },
           {
             visibility: 'off'
           }
         ]
       },
       {
         featureType: 'road',
         elementType: 'labels.text.fill',
         stylers: [
           {
             color: '#767676'
           }
         ]
       },
       {
         featureType: 'road',
         elementType: 'labels.text.stroke',
         stylers: [
           {
             color: '#ffffff'
           }
         ]
       },
       {
         featureType: 'transit.station.airport',
         elementType: 'labels.text.fill',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'transit.station.airport',
         elementType: 'labels.icon',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       },
       {
         featureType: 'water',
         elementType: 'all',
         stylers: [
           {
             saturation: 43
           },
           {
             lightness: -11
           },
           {
             color: '#89cada'
           }
         ]
       },
       {
         featureType: 'water',
         elementType: 'geometry',
         stylers: [
           {
             visibility: 'on'
           }
         ]
       }
     ]
   });

    if (isWorldView) {
     this.setUpWorldView();
   }
    if (this.placeMarkerOnClick) {
      google.maps.event.addListener(this.map, 'click', function(event) {
          this.placeMarker(event.latLng);
          this.mapClicked.emit(event);
      }.bind(this));
    } else {
      google.maps.event.addListener(this.map, 'click', function(event) {
        this.mapClicked.emit(event);
      }.bind(this));
    }

    this.drawingManager = new google.maps.drawing.DrawingManager({
     drawingMode: google.maps.drawing.OverlayType.MARKER,
     drawingControl: this.showControl,
     drawingControlOptions: {
       // tslint:disable-next-line:no-string-literal
       position: google.maps.ControlPosition[this.position],
       drawingModes: this.showModes
     },
     markerOptions: {
       icon: this.markerOption.icon,
       title: this.markerOption.title,
       animation: google.maps.Animation[this.markerOption.animation],
       draggable: this.markerOption.draggable
     },
     circleOptions: {
       fillColor: this.circleOption.fillColor,
       fillOpacity: this.circleOption.fillOpacity,
       strokeColor: this.circleOption.strokeColor,
       strokeWeight: this.circleOption.strokeWeight,
       clickable: this.circleOption.clickable,
       editable: this.circleOption.editable,
       draggable: this.circleOption.draggable,
       zIndex: this.circleOption.zIndex
     },
     polygonOptions: {
       fillColor: this.polygonOption.fillColor,
       fillOpacity: this.polygonOption.fillOpacity,
       strokeColor: this.polygonOption.strokeColor,
       strokeWeight: this.polygonOption.strokeWeight,
       clickable: this.polygonOption.clickable,
       editable: this.polygonOption.editable,
       draggable: this.polygonOption.draggable,
       zIndex: this.polygonOption.zIndex
     },
     rectangleOptions: {
       fillColor: this.rectangleOption.fillColor,
       fillOpacity: this.rectangleOption.fillOpacity,
       strokeColor: this.rectangleOption.strokeColor,
       strokeWeight: this.rectangleOption.strokeWeight,
       clickable: this.rectangleOption.clickable,
       editable: this.rectangleOption.editable,
       draggable: this.rectangleOption.draggable,
       zIndex: this.rectangleOption.zIndex
     },
     polylineOptions: {
       fillColor: this.polylineOption.fillColor,
       fillOpacity: this.polylineOption.fillOpacity,
       strokeColor: this.polylineOption.strokeColor,
       strokeWeight: this.polylineOption.strokeWeight,
       clickable: this.polylineOption.clickable,
       editable: this.polylineOption.editable,
       draggable: this.polylineOption.draggable,
       zIndex: this.polylineOption.zIndex
     }
   });

    this.drawingManager.setMap(this.map);

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function(event) {
     this.addOverlay(event);
     if (this.googleMapObjects) {
      this.overlayCompleted.emit(event); // output overlay complete
     } else {
      const temp = this.getOverlayType(event);
      this.overlayCompleted.emit(temp);
     }

   }.bind(this));

    if (this.customButtons) {
     this.initCustomButtons(this.map);
   }

    if (this.shapes && this.shapes.length > 0) {
     this.loadShapeToMap(this.shapes);
   }
 }

 private addOverlay(event: any) {
   if (this.allOverlays) {
     this.allOverlays.push(event);
   }
   if (event.type !== google.maps.drawing.OverlayType.MARKER) {
     this.drawingManager.setDrawingMode(null);
     const newShape = event.overlay;
     newShape.type = event.type;

     google.maps.event.addListener(newShape, 'click', function() {
       this.setSelection(newShape);
     }.bind(this));

     this.setSelection(newShape);
   }
 }

 // Place a marker on click
 public placeMarker(location: any) {
   const marker = new google.maps.Marker({
     position: location,
     map: this.map,
     icon: this.markerOption.icon,
     title: this.markerOption.title,
     animation: google.maps.Animation[this.markerOption.animation],
     draggable: this.markerOption.draggable
   });
 }

 // Initialize custom buttons
 public initCustomButtons(map: any): any {

   let showButtons = this.customButtonsList;
   if (this.onlyCustomButtons && this.onlyCustomButtons.length > 0 ) {
     showButtons = this.customButtonsList.filter(a => this.onlyCustomButtons.includes(a.key));
   }
   if (showButtons && showButtons.length > 0) {
     for (const button of showButtons) {

       const controlDiv = document.createElement('div');
       controlDiv.style.marginRight = '2px';

       const controlUI = document.createElement('div');
       controlUI.style.backgroundColor = '#fff';
       controlUI.style.border = '2px solid #fff';
       controlUI.style.borderRadius = '3px';
       controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
       controlUI.style.cursor = 'pointer';
       controlUI.style.marginTop = '5px';
       controlUI.style.marginBottom = '5px';
       controlUI.style.width = '23px';
       controlUI.style.height = '20px';
       controlUI.style.textAlign = 'center';
       controlUI.title = button.label;
       controlDiv.appendChild(controlUI);

       const controlText = document.createElement('div');
       controlText.style.color = 'rgb(25,25,25)';
       controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
       controlText.style.fontSize = '12px';
       controlText.style.lineHeight = '20px';
       controlText.style.paddingLeft = '3px';
       controlText.style.paddingRight = '3px';
       controlText.innerHTML = `<span> ${ iconValues[button.key] } </span>`;
       controlUI.appendChild(controlText);

       controlUI.addEventListener('click', function() {
         this.handleCustomButtonEvent(button.key);
       }.bind(this));

       map.controls[google.maps.ControlPosition[this.position]].push(controlDiv);

     }
   } else {
     this.showError('please check onlyCustomButtons property', this.onlyCustomButtons);
   }
 }

 // Handles custom button events
 public handleCustomButtonEvent(button: string) {

   switch (button) {
     case 'undo': {
        this.undoShape();
        break;
     }
     case 'clear': {
       this.deleteAllShape();
       break;
     }
     case 'delete': {
       this.deleteSelectedShape();
       break;
    }
     case 'save': {
        this.saveSelectedShape();
        break;
     }
     case 'saveAll': {
       this.saveAllShape();
       break;
    }
  }
 }

 // set selected shape on map
 public setSelection(shape: any) {
   this.clearSelection();
   this.selectedShape = shape;
   shape.setEditable(true);
   if (this.googleMapObjects) {
    this.overlaySelected.emit(shape); // output overlay selected
   } else {
    const temp = this.getOverlayType(shape);
    this.overlaySelected.emit(temp);
   }
 }

 // clears selected shape on map
 public clearSelection() {
   if (this.selectedShape) {
     this.selectedShape.setEditable(false);
     this.selectedShape = null;
   }
 }

 // deletes selected shape
 public deleteSelectedShape() {
   if (this.selectedShape) {
     this.selectedShape.setMap(null);
   }
 }

 // outputs the selected shape
 public saveSelectedShape() {
   if (this.googleMapObjects) {
     this.saveSeleted.emit(this.selectedShape); // output overlay selected
   } else {
     if (this.selectedShape) {
       const shape = this.getOverlayType(this.selectedShape);
       this.saveSeleted.emit(shape);
       console.log(shape);
     }
   }
 }

 // deletes all the shape on map
 public deleteAllShape() {
   // tslint:disable-next-line:prefer-for-of
   for (let i = 0; i < this.allOverlays.length; i++) {
     this.allOverlays[i].overlay.setMap(null);
   }
   this.allOverlays = [];
 }

 // undo the last action
 public undoShape() {
   if (this.allOverlays !== undefined && this.allOverlays !== null && this.allOverlays.length >= 1) {
     this.allOverlays[this.allOverlays.length - 1].overlay.setMap(null);
     this.allOverlays.pop();
   }
 }

 // outputs all shapes
 public saveAllShape() {

     if (this.allOverlays && this.allOverlays.length > 0) {
       if (this.googleMapObjects) {
         this.saveAll.emit(this.allOverlays);
       } else {
         const shapes: Shape[] = [];
         for (const overLay of this.allOverlays) {
           if (overLay) {
             const shape = this.getOverlayType(overLay);
             if (shape) {
             shapes.push(shape);
             }
           }
         }
         this.saveAll.emit(shapes);
       }
     }
 }

 // returns an shape object
 private getOverlayType(object: any): Shape {

   let shape: Shape = null;
   let overlay = null;
   if (object.map) {
     overlay = object;
   } else if (object.overlay.map) {
     overlay = object.overlay;
   } else {
     this.showError('Error while reading overlay, try googleMapObjects = true', object);
     return;
   }
   if (object.type === 'circle') {
     const center: LatLang = { lat: overlay.center.lat(), lng: overlay.center.lng() };
     const circle: Circle = { center, radius: overlay.radius };
     shape = {
       type: object.type,
       shape: circle
     };

   } else if (object.type === 'polygon' || object.type === 'polyline') {

     const center: LatLang = { lat: overlay.map.center.lat(), lng: overlay.map.center.lng() };
     const tempPoints = overlay.latLngs.j[0].j;
     const points: LatLang[] = [];
     for (const p of tempPoints) {
       const point: LatLang = { lat: p.lat(), lng: p.lng() };
       points.push(point);
     }
     const polygon: Polygon = { center, points };
     shape = {
       type: object.type,
       shape: polygon
     };
   } else if (object.type === 'rectangle') {

     const center: LatLang = { lat: overlay.map.center.lat(), lng: overlay.map.center.lng() };
     // tslint:disable-next-line:no-shadowed-variable
     const bounds = overlay.getBounds();
     const neBound: LatLang = { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() };
     const swBound: LatLang = { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() };
     const rectangle: Rectangle = { center, northEastBound: neBound, southWestBound: swBound };
     shape = {
       type: object.type,
       shape: rectangle
     };
   } else if (object.type === 'marker') {
     const center: LatLang = { lat: overlay.map.center.lat(), lng: overlay.map.center.lng() };
     const position: LatLang = { lat: overlay.position.lat(), lng: overlay.position.lng() };
     const marker: Marker = {center , position };
     shape = {
       type: object.type,
       shape: marker
     };
   }

   return shape;
 }

 // sets shapes on map
 private loadShapeToMap(shapes: Shape[]) {

   if (shapes && shapes.length > 0) {
     for (let i = 0; i < shapes.length; i++) {
       const shape = shapes[i];
       if (shape.type === 'marker') {
         const markerObj: Marker = shape.shape;
         const marker = new google.maps.Marker({
           position: markerObj.position,
           map: this.map,
           icon: this.markerOption.icon,
           title: this.markerOption.title,
           animation: google.maps.Animation[this.markerOption.animation],
           draggable: this.markerOption.draggable
         });

         const overlay: OverLay = {
           type: 'marker',
           overlay: marker
         };
         this.addOverlay(overlay);

         if (this.isWorldView && i === 0) {
           const bounds = new google.maps.LatLngBounds();
           const latLng = new google.maps.LatLng(markerObj.position.lat, markerObj.position.lng);
           bounds.extend(latLng);
           this.map.fitBounds(bounds);
         }
       } else if (shape.type === 'circle') {
         const circleObj: Circle = shape.shape;
         const circle = new google.maps.Circle({
           fillColor: this.circleOption.fillColor,
           fillOpacity: this.circleOption.fillOpacity,
           strokeColor: this.circleOption.strokeColor,
           strokeWeight: this.circleOption.strokeWeight,
           clickable: this.circleOption.clickable,
           editable: this.circleOption.editable,
           draggable: this.circleOption.draggable,
           zIndex: this.circleOption.zIndex,
           map: this.map,
           center: circleObj.center,
           radius: circleObj.radius
         });
         const overlay: OverLay = {
           type: 'circle',
           overlay: circle
         };
         this.addOverlay(overlay);

         if (this.isWorldView && i === 0) {
           this.map.fitBounds(circle.getBounds());
         }

       } else if (shape.type === 'polygon') {
         const polygonObj: Polygon = shape.shape;
         const polygon = new google.maps.Polygon({
           paths: polygonObj.points,
           fillColor: this.polygonOption.fillColor,
           fillOpacity: this.polygonOption.fillOpacity,
           strokeColor: this.polygonOption.strokeColor,
           strokeWeight: this.polygonOption.strokeWeight,
           clickable: this.polygonOption.clickable,
           editable: this.polygonOption.editable,
           draggable: this.polygonOption.draggable,
           zIndex: this.polygonOption.zIndex
         });
         polygon.setMap(this.map);
         const overlay: OverLay = {
           type: 'polygon',
           overlay: polygon
         };
         this.addOverlay(overlay);

         if (this.isWorldView && i === 0) {
         const bounds = new google.maps.LatLngBounds();
         // tslint:disable-next-line:prefer-for-of
         for (let j = 0; j < polygonObj.points.length; j++) {
           const latLng = new google.maps.LatLng(polygonObj.points[j].lat, polygonObj.points[j].lng);
           bounds.extend(latLng);
         }
         this.map.fitBounds(bounds);
       }
       } else if (shape.type === 'rectangle') {
         const rectangleObj: Rectangle = shape.shape;
         const rectangle = new google.maps.Rectangle({
           fillColor: this.rectangleOption.fillColor,
           fillOpacity: this.rectangleOption.fillOpacity,
           strokeColor: this.rectangleOption.strokeColor,
           strokeWeight: this.rectangleOption.strokeWeight,
           clickable: this.rectangleOption.clickable,
           editable: this.rectangleOption.editable,
           draggable: this.rectangleOption.draggable,
           zIndex: this.rectangleOption.zIndex,
           map: this.map,
           bounds: {
             north: rectangleObj.northEastBound.lat,
             south: rectangleObj.southWestBound.lat,
             east: rectangleObj.northEastBound.lng,
             west: rectangleObj.southWestBound.lng
           }
         });
         const overlay: OverLay = {
           type: 'rectangle',
           overlay: rectangle
         };
         this.addOverlay(overlay);

         if (this.isWorldView && i === 0) {
           this.map.fitBounds(rectangle.getBounds());
         }
       } else if (shape.type === 'polyline') {
         const polygonObj: Polygon = shape.shape;
         const polygon = new google.maps.Polygon({
           paths: polygonObj.points,
           fillColor: this.polygonOption.fillColor,
           fillOpacity: this.polygonOption.fillOpacity,
           strokeColor: this.polygonOption.strokeColor,
           strokeWeight: this.polygonOption.strokeWeight,
           clickable: this.polygonOption.clickable,
           editable: this.polygonOption.editable,
           draggable: this.polygonOption.draggable,
           zIndex: this.polygonOption.zIndex
         });
         polygon.setMap(this.map);
         const overlay: OverLay = {
           type: 'polyline',
           overlay: polygon
         };
         this.addOverlay(overlay);

         if (this.isWorldView && i === 0) {
         const bounds = new google.maps.LatLngBounds();
         // tslint:disable-next-line:prefer-for-of
         for (let j = 0; j < polygonObj.points.length; j++) {
           const latLng = new google.maps.LatLng(polygonObj.points[j].lat, polygonObj.points[j].lng);
           bounds.extend(latLng);
         }
         this.map.fitBounds(bounds);
       }
     }
   }
 }
}

 private showError(message: string, object: any) {
   if (this.showErrors) {
     if (object) {
       console.error(`ngx-google-map-helper: ${message}`, object);
     } else {
       console.error(`ngx-google-map-helper: ${message}`);
     }
   }
 }

}
