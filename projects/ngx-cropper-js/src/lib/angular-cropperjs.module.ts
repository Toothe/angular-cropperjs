import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CropperComponent } from './cropper/cropper.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CropperComponent],
    exports: [CropperComponent]
})
export class AngularCropperjsModule {
}
