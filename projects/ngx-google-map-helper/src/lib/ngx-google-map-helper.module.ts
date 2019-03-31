import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxGoogleMapHelperComponent } from './ngx-google-map-helper.component';
import { NgxGoogleMapHelperService } from './ngx-google-map-helper.service';

@NgModule({
  declarations: [NgxGoogleMapHelperComponent],
  imports: [
  ],
  exports: [NgxGoogleMapHelperComponent]
})
export class NgxGoogleMapHelperModule {
    static forRoot(key: string): ModuleWithProviders {
      return {
        ngModule: NgxGoogleMapHelperModule,
        providers: [NgxGoogleMapHelperService]
      };
    }
}
