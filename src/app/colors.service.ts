import { Injectable } from '@angular/core';

@Injectable()
export class ColorsService {

  constructor() { }

  private generateBW() {
    const colorArr = [];
    for (let i = 0; i < 256; i++) {
      colorArr.push([i, i, i]);
    }
    return colorArr;
  }

  private generateBWSmooth() {
    const colorArr = [];
    for (let i = 0; i < 256; i++) {
      colorArr.push([i, i, i]);
    }
    for (let i = 255; i > 0; i--) {
      colorArr.push([i, i, i]);
    }
    return colorArr;
  }

  generateBWLine(size = 256, weight = 100, smooth = true) {
    const colorArr = [];
    // Normalize weight between 1 and 100
    if (weight > 100) {
      weight = 100;
    }
    if (weight < 1) {
      weight = 1;
    }

    // Calculate how big the while lines will be relative to the size
    let scale = size * (weight / 100);

    // Smooth transitions take up double the space, so we'll half the scale
    if(smooth) {
      scale = scale / 2;
    }

    /* There are only 256 B-W colors that we can pick from.
     * So we need to be able to take whatever size/scale the image is and
     * distribute it over that 256 color range.
     * A scale of 256 should have a 1 to 1 parity.
     * But for a scale of 600, every 2.34 pixels should change color.
     * If the scale is 100 we shoud skip every 2.56 colors
     */
    const block = scale / 256;

    for (let i = 0; i < scale; i++) {
      // Here we get the integer based on the block size for the B-W color
      const color = Math.floor(i / block);
      colorArr.push([color, color, color]);
    }

    // If the smooth option is specified, then we can go back in the other direction
    if (smooth) {
      for (let i = scale - 1; i > 0; i--) {
        const color = Math.floor(i / block);
        colorArr.push([color, color, color]);
      }
    }

    // We pad any remainer with black space
    const currentSize = colorArr.length;
    for (let i = 0; i < (size - currentSize); i++) {
      colorArr.push([0, 0, 0]);
    }

    return colorArr;
  }

  get bwSmooth() { return this.generateBWSmooth(); }
  get bw() { return this.generateBWSmooth(); }

}
