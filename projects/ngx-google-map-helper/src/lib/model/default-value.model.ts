import { OverLayOption } from './overlay.model';
import { MarkerOption } from './overlay.model';
import { CustomButton } from './custom-button.model';
import { LatLang } from './latlang.model';

export  interface DefaultValuesModel {
    drawingModes: string[];
    handlerPositions: string[];
    defaultOverlayValues: OverLayOption;
    defaultMarkerValues: MarkerOption;
    customButtons: CustomButton[];
    height: string;
    width: string;
    zoom: number;
    center: LatLang;
}
