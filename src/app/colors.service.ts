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
    if (smooth) {
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

  generateRainbow(size = 360, weight = 100, smooth = true) {
    const colorArr = [];
    const inc = size / 360;
    for (let i = 0; i < size; i++) {
      const color = this._hsvToRgb(i / inc, 1, 1);
      colorArr.push(color);
    }

    return colorArr;
  }

  /** Converts HSV colors to RGB */
  private _hsvToRgb(hue: number, saturation: number, value: number) {
    // Make sure HSV values are correct
    if (hue > 360) {
      hue = 360;
    } else if (hue < 0) {
      hue = 0;
    }
    if (saturation > 1) {
      saturation = 1;
    } else if (saturation < 0) {
      saturation = 0;
    }
    if (value > 1) {
      value = 1;
    } else if (value < 0) {
      value = 0;
    }

    // Get Chroma, H', and X
    const c = value * saturation;
    const h = hue / 60;
    const x = c * (1 - Math.abs(h % 2 - 1));
    let rgb = [0, 0, 0];

    // Find the initial RGB values
    if (0 <= h && h <= 1) {
      rgb = [c, x, 0];
    } else if (1 <= h && h <= 2) {
      rgb = [x, c, 0];
    } else if (2 <= h && h <= 3) {
      rgb = [0, c, x];
    } else if (3 <= h && h <= 4) {
      rgb = [0, x, c];
    } else if (4 <= h && h <= 5) {
      rgb = [x, 0, c];
    } else if (5 <= h && h <= 6) {
      rgb = [c, 0, x];
    }

    // Now we match value
    const m = value - c;

    rgb = rgb.map(v => (v + m) * 255);

    return rgb;
  }

  get bwSmooth() { return this.generateBWSmooth(); }
  get bw() { return this.generateBWSmooth(); }

}
