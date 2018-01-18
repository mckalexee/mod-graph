import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { ColorsService } from '../colors.service';

@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss'],
})
export class ModComponent implements OnInit, OnDestroy {
  @ViewChild('mainCanvas') canvas: ElementRef;

  imgMap: { [key: number]: ImageData } = {};

  private ctx: CanvasRenderingContext2D;
  isRunning: boolean;
  reqID: number;
  private rectSize = 0;

  canvasHeight = 1;
  canvasWidth = 1;
  colorArray = [];
  colorHash = '';
  frame = 0;
  speed = 1;
  size = 256;
  weight = 100;

  constructor(private ngZone: NgZone, private color: ColorsService) { }

  ngOnInit() {
    this.colorArray = this.color.generateBWLine(this.size, this.weight, true);
    this.ngZone.runOutsideAngular(() => this.draw());
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.isRunning = true;
    this.setCanvasSize();
    this.draw();

  }

  ngOnDestroy() {
    this.isRunning = false;
  }

  stop() {
    this.isRunning = false;
    window.cancelAnimationFrame(this.reqID);
  }

  start() {
    this.clearCache();
    this.isRunning = true;
    this.draw();
  }

  updateSize(size: number) {

    if (size < 1) {
      size = 1;
    }
    this.size = size;
    this.colorArray = this.color.generateBWLine(size, this.weight, true);
    this.clearCache();
  }

  /** Reload the color array based on a new weight */
  updateWeight(weight: number) {
    this.stop();
    if (weight < 1) {
      weight = 1;
    }
    if (weight > 100) {
      weight = 100;
    }
    this.weight = weight;
    this.colorArray = this.color.generateBWLine(this.size, weight, true);
    this.clearCache();
    this.start();
  }

  /** Clears the image cache when parameters changee */
  clearCache() {
    this.imgMap = {};
  }

  @HostListener('window:resize', ['$event'])
  setCanvasSize(e?: UIEvent) {
    this.canvasHeight = window.innerHeight;
    this.canvasWidth = window.innerWidth;
  }


  private draw() {
    if (!this.isRunning) {
      return;
    }
    const size = this.colorArray.length;

    let imageData: ImageData;
    if (this.imgMap[this.frame]) {
      imageData = this.imgMap[this.frame];
    } else {

      imageData = this.ctx.createImageData(this.size, this.size);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const x = Math.floor(i / 4 % this.size);
        const y = Math.floor(i / (4 * this.size));
        // console.log(y);
        const p = this.getPixelIndex(x, y, size, this.frame);


        data[i] = this.colorArray[p][0];
        data[i + 1] = this.colorArray[p][1];
        data[i + 2] = this.colorArray[p][2];
        data[i + 3] = 255;
      }

      this.imgMap[this.frame] = imageData;
    }

    // Tile the created image based on the canvas size
    for (let x = 0; x < Math.floor(this.canvasWidth / this.size) + 1; x++) {
      for (let y = 0; y < Math.floor(this.canvasHeight / this.size) + 1; y++) {
        this.ctx.putImageData(imageData, this.size * x, this.size * y);
      }
    }

    // this.ctx.putImageData(imageData, 0, 0);

    this.frame = Math.floor(this.frame + this.speed) % size;
    this.reqID = window.requestAnimationFrame(() => this.draw());
  }

  private getPixelIndex(x: number, y: number, size: number, frame: number) {
    return (x * y + frame) % size;
  }

}
