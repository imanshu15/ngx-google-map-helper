import { OverLayOption } from './overlay.model';
import { MarkerOption } from './overlay.model';
import { CustomButton } from './custom-button.model';

export  interface DefaultValuesModel {
    drawingModes: string[];
    handlerPositions: string[];
    defaultOverlayValues: OverLayOption;
    defaultMarkerValues: MarkerOption;
    customButtons: CustomButton[];
}
