import { Component, OnInit } from '@angular/core';
import { LatLang, OverLayOption, MarkerOption, Shape, Marker, Circle } from 'projects/ngx-google-map-helper/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Ngx Google Map Helper Demo';

   width = '100%';
   height = '500px';
   zoom = 7;
   center: LatLang = {lat: 7.8731, lng: 80.7718};
   controlPosition = 'BOTTOM_LEFT';
   common: OverLayOption = {
    fillColor: '#3DFCE8',
    fillOpacity: 0.2,
    strokeColor: '#3DFCE8',
    strokeWeight: 3,
    clickable: true,
    editable: true,
    draggable: true,
    zIndex: 1
  };

   circle: OverLayOption = {
    fillColor: '#F33DFC',
    fillOpacity: 0.2,
    strokeColor: '#F33DFC',
    strokeWeight: 3,
    clickable: true,
    editable: true,
    draggable: true,
    zIndex: 1
  };
   marker: MarkerOption = {
    animation: 'DROP',
    draggable: true,
    title: '',
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
  };

   shapes: Shape[] = [];


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    const marker: Marker = {
      center: {lat: 6.885513899999999, lng: 79.86900400000002 },
      position: {lat: 7.62306556776386, lng: 80.1649482138672}
    };
    const circle: Circle = {
      center: {lat: 7.0278384653057815, lng: 77.6106269248047},
      radius: 147844.30899599823
    };
    this.shapes.push({shape: marker, type: 'marker'});
    this.shapes.push({shape: circle, type: 'circle'});
  }

  onMapClicked(event: any) {
    console.log(event);
  }

  onOverLayCompleted(event: any) {
    console.log(event);
  }

  onOverLaySelected(event: any) {
    console.log(event);
  }

  onSaveSelected(event: any) {
    console.log(event);
  }

  onSaveAll(event: any) {
    console.log(event);
  }
}
