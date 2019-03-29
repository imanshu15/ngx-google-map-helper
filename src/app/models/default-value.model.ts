import { OverLayOption } from './overlay-option.model';
import { MarkerOption } from './marker-option.model';
import { CustomButton } from './custom-button.model';

export  interface DefaultValuesModel {
    drawingModes: string[];
    handlerPositions: string[];
    defaultOverlayValues: OverLayOption;
    defaultMarkerValues: MarkerOption;
    customButtons: CustomButton[];
}
