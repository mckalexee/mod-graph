import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { ModComponent } from './mod/mod.component';
import { ColorsService } from './colors.service';


@NgModule({
  declarations: [
    AppComponent,
    ModComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ColorsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
