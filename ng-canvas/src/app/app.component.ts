import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  canvas: fabric.Canvas;
  drawMode = 'rect';

  constructor() { }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas');

    this.setObservers();

    this.canvas.add(new fabric.Rect({
      width: 100,
      height: 100,
      left: 20,
      top: 20,
      fill: 'green'
    }));
  }

  setObservers() {
    this.canvas.on('mouse:move', e => { this.mousemove(e); });
    this.canvas.on('mouse:down', e => { this.mousedown(e); });
    this.canvas.on('mouse:up', e => { this.mouseup(e); });
  }

  /* Mousedown */
  mousedown(e) {
    if (!this.drawMode) {
      return;
    }

    const x = e.pointer.x;
    const y = e.pointer.y;

    const obj = ShapeFactory.newInstance(this.drawMode, x, y);

    this.canvas.add(obj);
    this.canvas.renderAll();
    this.canvas.setActiveObject(obj);
  }


  /* Mousemove */
  mousemove(e) {
    if (!this.drawMode) {
      return;
    }

    const shape = (this.canvas.getActiveObject() as any);
    (shape as Shape).update(e.pointer.x, e.pointer.y);
    this.canvas.renderAll();
  }

  /* Mouseup */
  mouseup(e) {
    if (!this.drawMode) {
      return;
    }

    this.drawMode = null;

    const shape = this.canvas.getActiveObject();
    this.canvas.add(shape);
    this.canvas.renderAll();
  }

  setDrawMode(mode) {
    if (mode === 'free-draw') {
      this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
      return;
    }

    this.drawMode = mode;
  }

}

interface Shape {
  update(x, y);
}

class ShapeFactory {
  public static newInstance(drawMode, x, y) {

    switch (drawMode) {
      case 'rect': return new Rectangle(x, y);
      case 'circle': return new Circle(x, y);
      case 'triangle': return new Triangle(x, y);
      case 'ellipse': return new Ellipse(x, y);
      case 'line': return new Line(x, y);
    }

    return null;
  }
}

class Rectangle extends fabric.Rect implements Shape {
  x: number;
  y: number;

  constructor(x, y) {
    super({
      width: 0,
      height: 0,
      left: x,
      top: y,
      fill: 'green'
    });

    this.x = x;
    this.y = y;
  }

  update(x, y) {
    const w = Math.abs(x - this.x);
    const h = Math.abs(y - this.y);

    if (!w || !h) {
      return false;
    }

    this.set('width', w);
    this.set('height', h);
  }
}

class Circle extends fabric.Circle implements Shape {
  x: number;
  y: number;

  constructor(x, y) {
    super({
      radius: 0,
      left: x,
      top: y,
      fill: 'red'
    });

    this.x = x;
    this.y = y;
  }

  update(x, y) {

    const radius = Math.abs(x - this.x) / 2;

    if (!radius) {
      return false;
    }

    this.set('radius', radius);
  }
}

class Triangle extends fabric.Triangle implements Shape {
  x: number;
  y: number;

  constructor(x, y) {
    super({
      width: 0,
      height: 0,
      left: x,
      top: y,
      fill: 'yellow'
    });

    this.x = x;
    this.y = y;
  }

  update(x, y) {

    const w = Math.abs(x - this.x);
    const h = Math.abs(y - this.y);

    if (!w || !h) {
      return false;
    }

    this.set('width', w);
    this.set('height', h);
  }
}

class Ellipse extends fabric.Ellipse implements Shape {
  x: number;
  y: number;

  constructor(x, y) {
    super({
      rx: 0,
      ry: 0,
      left: x,
      top: y,
      fill: 'cyan'
    });

    this.x = x;
    this.y = y;
  }

  update(x, y) {

    const w = Math.abs(x - this.x) / 2;
    const h = Math.abs(y - this.y) / 2;

    if (!w || !h) {
      return false;
    }

    this.set('rx', w);
    this.set('ry', h);
  }
}


class Line extends fabric.Line implements Shape {
  x: number;
  y: number;

  constructor(x, y) {
    super([x, y, x, y], {
      fill: 'red',
      stroke: 'cyan'
    });

    this.x = x;
    this.y = y;
  }

  update(x, y) {
    const a = {x2: x, y2: y} as Partial<this>;
    this.set(a);
  }
}
