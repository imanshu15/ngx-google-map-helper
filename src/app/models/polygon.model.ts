import { LatLang } from './latlang.model';

export interface Polygon {
    center: LatLang;
    points: LatLang[];
  }
