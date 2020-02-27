import { Component, ViewEncapsulation, ElementRef, ViewChild, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import Cropper from 'cropperjs';
import { CropperOptions, ImageCropperResult, ImageCropperSetting } from './cropper.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'angular-cropper',
    templateUrl: './cropper.component.html',
    styleUrls: ['./cropper.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CropperComponent implements OnChanges {

    @ViewChild('image', { static: true }) image: ElementRef;

    @Input() imageUrl: any;
    @Input() settings: ImageCropperSetting;
    @Input() cropbox: Cropper.CropBoxData;
    @Input() loadImageErrorText: string;
    @Input() cropperOptions: CropperOptions = {};

    @Output() export = new EventEmitter<ImageCropperResult>();
    @Output() ready = new EventEmitter();

    public cropper: Cropper;
    public imageElement: HTMLImageElement;
    public loadError: any;
    public isLoading = true;
    public safeImageUrl: SafeUrl;

    public constructor(private Sanitizer: DomSanitizer) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.imageUrl && changes.imageUrl.previousValue !== changes.imageUrl.currentValue) {
            this.safeImageUrl = this.Sanitizer.bypassSecurityTrustUrl(changes.imageUrl.currentValue);
            console.log(this.safeImageUrl);
        }
    }

    /**
     * Image loaded
     */
    public imageLoaded(ev: Event) {
        //
        // Unset load error state
        this.loadError = false;

        //
        // Setup image element
        const image = ev.target as HTMLImageElement;
        this.imageElement = image;

        //
        // Add crossOrigin?
        if (this.cropperOptions.checkCrossOrigin) {
            image.crossOrigin = 'anonymous';
        }

        //
        // Image on ready event
        image.addEventListener('ready', () => {
            //
            // Emit ready
            this.ready.emit(true);

            //
            // Unset loading state
            this.isLoading = false;

            //
            // Validate cropbox existance
            if (this.cropbox) {

                //
                // Set cropbox data
                this.cropper.setCropBoxData(this.cropbox);
            }
        });

        //
        // Setup aspect ratio according to settings
        let aspectRatio = NaN;
        if (this.settings) {
            const { width, height } = this.settings;
            aspectRatio = width / height;
        }

        //
        // Set crop options
        // extend default with custom config
        this.cropperOptions = Object.assign({
            aspectRatio,
            movable: false,
            scalable: false,
            zoomable: false,
            viewMode: 1,
            checkCrossOrigin: true
        }, this.cropperOptions);

        //
        // Set cropperjs
        this.cropper = new Cropper(image, this.cropperOptions);
    }

    /**
     * Image load error
     */
    public imageLoadError(event: any) {

        //
        // Set load error state
        this.loadError = true;

        //
        // Unset loading state
        this.isLoading = false;
    }

    /**
     * Export canvas
     */
    public exportCanvas(base64?: any) {
        //
        // Get and set image, crop and canvas data
        const imageData = this.cropper.getImageData();
        const cropData = this.cropper.getCropBoxData();
        const canvas = this.cropper.getCroppedCanvas();
        const data = { imageData, cropData };

        //
        // Create promise to resolve canvas data
        const promise = new Promise(resolve => {

            //
            // Validate base64
            if (base64) {

                //
                // Resolve promise with dataUrl
                return resolve({
                    dataUrl: canvas.toDataURL('image/png')
                });
            }
            canvas.toBlob(blob => resolve({ blob }));
        });

        //
        // Emit export data when promise is ready
        promise.then(res => {
            this.export.emit(Object.assign(data, res));
        });
    }
}
