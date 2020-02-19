import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AngularCropperjsModule } from 'ngx-cropper-js';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AngularCropperjsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
