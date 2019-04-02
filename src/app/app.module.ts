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
      apiKey: 'XXXXXXXXXXXXXXXXXXXXXX'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
