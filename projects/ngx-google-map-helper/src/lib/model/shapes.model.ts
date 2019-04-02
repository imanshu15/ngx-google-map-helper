import { LatLang } from './latlang.model';

export interface Shape {
    type: string;
    shape: any;
}

export interface Circle {
    center: LatLang;
    radius: number;
}

export interface Rectangle {
    center: LatLang;
    northEastBound: LatLang;
    southWestBound: LatLang;
}

export interface Polygon {
    center: LatLang;
    points: LatLang[];
}

export interface Marker {
    center: LatLang;
    position: LatLang;
}
