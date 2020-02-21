import { CropperDragMode, CropperViewMode } from './cropper.enum';

export interface CropperOptions extends Cropper.Options {
    dragMode?: CropperDragMode;
    viewMode?: CropperViewMode;
}
