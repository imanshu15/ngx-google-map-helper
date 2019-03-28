import { DefaultValuesModel } from './default-value.model';

// tslint:disable-next-line:align
// tslint:disable-next-line:one-variable-per-declaration
const defaultValues: DefaultValuesModel = {
    drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle'],
    handlerPositions: ['TOP_CENTER', 'TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_CENTER', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'],
    defaultOverlayValues: {
        fillColor: '#005696',
        fillOpacity: 0.2,
        strokeColor: '#005696',
        strokeWeight: 3,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
    },
    defaultMarkerValues: {
        animation: 'DROP',
        draggable: true,
        title: '',
        icon: null
    }
};

export default defaultValues;
