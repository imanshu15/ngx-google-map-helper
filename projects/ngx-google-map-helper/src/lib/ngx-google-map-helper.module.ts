import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxGoogleMapHelperComponent } from './ngx-google-map-helper.component';
import { NgxGoogleMapHelperService } from './ngx-google-map-helper.service';
import { MapConfig } from './model/map-config.model';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [NgxGoogleMapHelperComponent],
  exports: [NgxGoogleMapHelperComponent],
  providers:    [ NgxGoogleMapHelperService ]
})
export class NgxGoogleMapHelperModule {

    static forRoot(config: MapConfig): ModuleWithProviders<NgxGoogleMapHelperModule> {
      return {
        ngModule: NgxGoogleMapHelperModule,
        providers: [
          {provide: MapConfig, useValue: config }
        ]
      };
    }
}
