import { LatLang } from './latlang.model';

export interface Rectangle {
    center: LatLang;
    northEastBound: LatLang;
    southWestBound: LatLang;
}
