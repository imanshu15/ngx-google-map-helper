export interface OverLay {
    type: string;
    overlay: any;
}

export interface OverLayOption {
    fillColor: string;
    fillOpacity: any;
    strokeColor: string;
    strokeWeight: 3;
    clickable: boolean;
    editable: boolean;
    draggable: boolean;
    zIndex: number;
}

export interface MarkerOption {
    title: string;
    icon: string;
    draggable: boolean;
    animation: string;
}
