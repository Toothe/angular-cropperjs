import { CropperDragMode, CropperViewMode } from './cropper.enum';

export interface CropperOptions extends Cropper.Options {
    dragMode?: CropperDragMode;
    viewMode?: CropperViewMode;
}

export interface ImageCropperSetting {
    width: number;
    height: number;
}

export interface ImageCropperResult {
    imageData: Cropper.ImageData;
    cropData: Cropper.CropBoxData;
    blob?: Blob;
    dataUrl?: string;
}
