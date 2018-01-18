import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { ColorsService } from '../colors.service';

@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss'],
})
export class ModComponent implements OnInit, OnDestroy {
  @ViewChild('mainCanvas') canvas: ElementRef;



  private ctx: CanvasRenderingContext2D;
  isRunning: boolean;
  reqID: number;
  private rectSize = 0;

  canvasHeight = 1;
  canvasWidth = 1;
  colorArray = [];
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
    this.isRunning = true;
    this.draw();
  }

  updateSize(size: number) {
    if (size < 1) {
      size = 1;
    }
    this.size = size;
    this.colorArray = this.color.generateBWLine(size, this.weight, true);
  }

  updateWeight(weight: number) {
    if (weight < 1) {
      weight = 1;
    }
    if (weight > 100) {
      weight = 100;
    }

    this.weight = weight;
    this.colorArray = this.color.generateBWLine(this.size, weight, true);
  }

  @HostListener('window:resize', ['$event'])
  setCanvasSize(e?: UIEvent) {
    this.canvasHeight = window.innerHeight;
    this.canvasWidth = window.innerWidth;
  }


  private draw() {
    // this.canvasHeight

    if (!this.isRunning) {
      return;
    }
    const size = this.colorArray.length;
    const imageData = this.ctx.createImageData(this.canvasWidth, this.canvasHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const x = Math.floor(i / 4 % this.canvasWidth);
      const y = Math.floor(i / (4 * this.canvasWidth));
      // console.log(y);
      const p = this.getPixelIndex(x, y, size, this.frame);


      data[i] = this.colorArray[p][0];
      data[i + 1] = this.colorArray[p][1];
      data[i + 2] = this.colorArray[p][2];
      data[i + 3] = 255;
    }

    this.ctx.putImageData(imageData, 0, 0);
    this.frame = (this.frame + this.speed) % size;
    this.reqID = window.requestAnimationFrame(() => this.draw());
  }

  private getPixelIndex(x: number, y: number, size: number, frame: number) {
    return (x * y + frame) % size;
  }

}
