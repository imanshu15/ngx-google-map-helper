import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapHelperComponent } from './components/map-helper/map-helper.component';

@NgModule({
  declarations: [
    AppComponent,
    MapHelperComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
