import { Component, OnInit, ElementRef } from '@angular/core';
import { Shape } from 'src/app/models/shape.model';
import { Cricle } from 'src/app/models/circle.model';
import { OverLay } from 'src/app/models/overlay.model';
import { Polygon } from 'src/app/models/polygon.model';
import { Rectangle } from 'src/app/models/rectangle.model';
import { LatLang } from 'src/app/models/latlang.model';

declare const google: any;

@Component({
  selector: 'app-map-helper',
  templateUrl: './map-helper.component.html',
  styleUrls: ['./map-helper.component.scss']
})
export class MapHelperComponent implements OnInit {

  lat: any = -34.397;
  lng: any = 150.644;
  zoom = 10;
  isWorldView = false;
  map: any;
  allOverlays: any = [];
  selectedShape: any;
  drawingManager: any;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    Promise.all([
      this.lazyLoadMap()
    ]).then(value => this.initMap());
  }

  lazyLoadMap() {
    const promise = new Promise((resolve, reject) => {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        resolve();
    } else {
        const mapKey = 'AIzaSyBffHC_gr01KYBQ7GA5HEtAyk0sf2kzJ9I'; // SHOULD CHANGE
        const s = document.createElement('script');
        s.setAttribute('id', 'googleMap');
        s.type = 'text/javascript';
        s.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=drawing`;
        this.elementRef.nativeElement.appendChild(s);
      }
    setTimeout(() => {
          resolve();
        }, 1000);
    });
    return promise;
  }

  initMap() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
        this.zoom = 10;
        this.setUpMap(false);
      }, error => {
        this.setUpMap(true);
        this.isWorldView = true;
      });
    } else {
      this.setUpMap(true);
      this.isWorldView = true;
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
    console.log('MAP', this.lng, this.lat);
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: this.lat,
        lng: this.lng
      },
      zoom: this.zoom,
      minZoom: 2,
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
    // google.maps.event.addListener(this.map, 'click', function(event) {
    //     this.placeMarker(event.latLng);
    //  }.bind(this));

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      circleOptions: {
        fillColor: '#005696',
        fillOpacity: 0.2,
        strokeColor: '#005696',
        strokeWeight: 3,
        clickable: false,
        editable: true,
        zIndex: 1
      },
      polygonOptions: {
        clickable: true,
        draggable: true,
        editable: true,
        strokeColor: '#005696',
        fillColor: '#005696',
        fillOpacity: 0.2,

      },
      rectangleOptions: {
        clickable: true,
        draggable: true,
        editable: true,
        strokeColor: '#005696',
        fillColor: '#005696',
        fillOpacity: 0.2,
      }
    });

    this.drawingManager.setMap(this.map);

    // tslint:disable-next-line:only-arrow-functions
    const getPolygonCoords = function(newShape) {
      console.log('We are one');
      const len = newShape.getPath().getLength();
      for (let i = 0; i < len; i++) {
        console.log(newShape.getPath().getAt(i).toUrlValue(6));
      }
    };

    // tslint:disable-next-line:only-arrow-functions
    google.maps.event.addListener(this.drawingManager, 'polygoncomplete', function(event) {
      console.log('POLYGON', event);
      event.getPath().getLength();
      // tslint:disable-next-line:only-arrow-functions
      google.maps.event.addListener(event.getPath(), 'insert_at', function() {
        const len = event.getPath().getLength();
        for (let i = 0; i < len; i++) {
          console.log(event.getPath().getAt(i).toUrlValue(5));
        }
      });
      // tslint:disable-next-line:only-arrow-functions
      google.maps.event.addListener(event.getPath(), 'set_at', function() {
        const len = event.getPath().getLength();
        for (let i = 0; i < len; i++) {
          console.log(event.getPath().getAt(i).toUrlValue(5));
        }
      });
    });

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function(event) {
      this.addOverlay(event);
    }.bind(this));
  }

  private addOverlay(event: any) {
    console.log(event);
    if (this.allOverlays) {
      this.allOverlays.push(event);
    }
    if (event.type !== google.maps.drawing.OverlayType.MARKER) {
      this.drawingManager.setDrawingMode(null);
      const newShape = event.overlay;
      newShape.type = event.type;
      google.maps.event.addListener(newShape, 'click', function() {
        this.setSelection(newShape);
      });

      this.setSelection(newShape);
    }
  }

  public placeMarker(location) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
  }

  public CenterControl(controlDiv, map): any {

    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Select to delete the shape';
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Delete Selected Area';
    controlUI.appendChild(controlText);

    // ----------------------------------

    const controlUI2 = document.createElement('div');
    controlUI2.style.backgroundColor = '#fff';
    controlUI2.style.border = '2px solid #fff';
    controlUI2.style.borderRadius = '3px';
    controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI2.style.cursor = 'pointer';
    controlUI2.style.marginBottom = '10px';
    controlUI2.style.textAlign = 'center';
    controlUI2.title = 'Select to save the shape';
    controlDiv.appendChild(controlUI2);

    const controlText2 = document.createElement('div');
    controlText2.style.color = 'rgb(25,25,25)';
    controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText2.style.fontSize = '16px';
    controlText2.style.lineHeight = '38px';
    controlText2.style.paddingLeft = '5px';
    controlText2.style.paddingRight = '5px';
    controlText2.innerHTML = 'Save Selected Area';
    controlUI2.appendChild(controlText2);

    controlUI.addEventListener('click', function() {
      this.deleteSelectedShape();
    }.bind(this));

    controlUI2.addEventListener('click', function() {
      this.saveSelectedShape();
    }.bind(this));

    return controlUI;
  }

  public setSelection(shape) {
    this.clearSelection();
    this.selectedShape = shape;
    shape.setEditable(true);
  }

  public deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
    }
  }

  public deleteAllShape() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.allOverlays.length; i++) {
      this.allOverlays[i].overlay.setMap(null);
    }
    this.allOverlays = [];
  }

  public undoShape() {
    if (this.allOverlays !== undefined && this.allOverlays !== null && this.allOverlays.length >= 1) {
      this.allOverlays[this.allOverlays.length - 1].overlay.setMap(null);
      this.allOverlays.pop();
    }
  }

  public clearSelection() {
    if (this.selectedShape) {
      this.selectedShape.setEditable(false);
      this.selectedShape = null;
    }
  }

  private loadShapeToMap(shapes: Shape[]) {

    if (shapes !== undefined && shapes !== null && shapes.length > 0) {
      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        if (shape.type === 'circle') {
          const circleObj: Cricle = shape.shape;
          const circle = new google.maps.Circle({
            fillColor: '#005696',
            fillOpacity: 0.35,
            strokeWeight: 3,
            clickable: true,
            editable: true,
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
        console.log('CIRCLE', circle.getBounds());
        }

        } else if (shape.type === 'polygon') {
          const polygonObj: Polygon = shape.shape;
          const polygon = new google.maps.Polygon({
            paths: polygonObj.points,
            clickable: true,
            draggable: true,
            editable: true,
            fillColor: '#005696',
            fillOpacity: 0.35,
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
            clickable: true,
            draggable: true,
            editable: true,
            fillColor: '#005696',
            fillOpacity: 0.35,
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
        }
      }
    }
  }

  public saveSelectedShape() {

      if (this.allOverlays !== undefined && this.allOverlays !== null && this.allOverlays.length > 0) {

        const shapes: Shape[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.allOverlays.length; i++) {
          const overLay = this.allOverlays[i].overlay;

          if (overLay.type === 'circle') {
            const center: LatLang = { lat: overLay.center.lat(), lng: overLay.center.lng() };
            const circle: Cricle = { center, radius: overLay.radius };
            const shape: Shape = {
              type: overLay.type,
              shape: circle
            };
            shapes.push(shape);
          } else if (overLay.type === 'polygon') {

            const center: LatLang = { lat: overLay.map.center.lat(), lng: overLay.map.center.lng() };
            const tempPoints = overLay.latLngs.j[0].j;
            const points: LatLang[] = [];
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < tempPoints.length; j++) {
              const p = tempPoints[j];
              const point: LatLang = { lat: p.lat(), lng: p.lng() };
              points.push(point);
            }
            const polygon: Polygon = { center, points };
            const shape: Shape = {
              type: overLay.type,
              shape: polygon
            };
            shapes.push(shape);
          } else if (overLay.type === 'rectangle') {

            const center: LatLang = { lat: overLay.map.center.lat(), lng: overLay.map.center.lng() };
            // tslint:disable-next-line:no-shadowed-variable
            const bounds = overLay.getBounds();
            const neBound: LatLang = { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() };
            const swBound: LatLang = { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() };
            const rectangle: Rectangle = { center, northEastBound: neBound, southWestBound: swBound };
            const shape: Shape = {
              type: overLay.type,
              shape: rectangle
            };
            shapes.push(shape);
          }
        }

        const jsonStrng = JSON.stringify(shapes);
        console.log('OUTPUT', jsonStrng);
      }
  }
}
