import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxGoogleMapHelperModule } from 'projects/ngx-google-map-helper/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxGoogleMapHelperModule.forRoot({
      apiKey: 'AIzaSyBffHC_gr01KYBQ7GA5HEtAyk0sf2kzJ9I'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
