import { Injectable, Optional } from '@angular/core';
import { MapConfig } from './model/map-config.model';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class NgxGoogleMapHelperService {

  private apiKey = '';

  constructor(@Optional() config: MapConfig) {
    if (config) { this.apiKey = config.key; }
  }

  public getApiKey(): string {
    return this.apiKey;
  }
}
