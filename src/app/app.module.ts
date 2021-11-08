import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxGoogleMapHelperModule } from 'projects/ngx-google-map-helper/src/public-api';
import { DefaultComponent } from './default/default.component';
import { PolylineComponent } from './polyline/polyline.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    PolylineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGoogleMapHelperModule.forRoot({
      apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
