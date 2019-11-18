export default class Canvas {
  constructor() {
    this.canvasDraw = document.querySelector('.display-canvas');
    this.draftCanvas = document.querySelector('.draft-canvas');
    this.sizesWrap = document.querySelector('.canvas-sizes');
    this.gayscaleBtn = document.querySelector('.btn_grayscale');
    this.clear = document.querySelector('.btn_clear');
    this.listeners();
    this.tool = null;
    this.color = null;
    this.line = 1;
    this.size = 512;
    this.startX = null;
    this.startY = null;
    this.imgSave = null;
    this.resizeImgSave = null;
  }

  listeners() {
    this.canvasDraw.addEventListener('mousedown', (e) => {
      if (this.tool === 'pencil-tool') this.pencil(e);
      if (this.tool === 'bucket-tool') this.bucketTool(e);
    });

    this.canvasDraw.addEventListener('mouseup', () => {
      this.imgSave = this.canvasDraw.toDataURL();
    });

    this.sizesWrap.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn_size')) {
        const resize = e.target.dataset.size;
        this.size = resize;
        const ratio = e.target.dataset.pen;
        this.line = +ratio;
        if (this.imgSave) this.reDrawCanvas(resize);
      }
    });

    this.gayscaleBtn.addEventListener('click', () => {
      if (this.imgSave) this.grayscaleConvert();
    });

    this.clear.addEventListener('click', Canvas.clearCanvas);
  }

  grayscaleConvert() {
    const canvas = this.canvasDraw;
    const ctx = canvas.getContext('2d');

    const idataSrc = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const idataTrg = ctx.createImageData(canvas.width, canvas.height);
    const dataSrc = idataSrc.data;
    const dataTrg = idataTrg.data;

    for (let i = 0; i < dataSrc.length; i += 4) {
      const luma = dataSrc[i] * 0.2126 + dataSrc[i + 1] * 0.7152 + dataSrc[i + 2] * 0.0722;
      dataTrg[i] = luma;
      dataTrg[i + 1] = luma;
      dataTrg[i + 2] = luma;
      dataTrg[i + 3] = dataSrc[i + 3];
    }
    Canvas.clearCanvas();
    ctx.putImageData(idataTrg, 0, 0);
  }

  reDrawCanvas(size) {
    const ctx = this.canvasDraw.getContext('2d');

    const tempCanvas = this.draftCanvas;
    const tempCtx = tempCanvas.getContext('2d');
    const resizeImage = new Image();
    resizeImage.src = this.imgSave;

    tempCanvas.width = size;
    tempCanvas.height = size;

    const reDraw = () => {
      tempCtx.drawImage(resizeImage, 0, 0, size, size);
      this.resizeImgSave = tempCanvas.toDataURL();

      const newImg = new Image();
      newImg.src = this.resizeImgSave;

      const mainCanvas = () => {
        Canvas.clearCanvas();
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.drawImage(newImg, 0, 0, 512, 512);
      };

      newImg.addEventListener('load', () => {
        mainCanvas();
      });
    };

    resizeImage.addEventListener('load', () => {
      reDraw();
    });
  }

  drawImage(param, img) {
    Canvas.clearCanvas();

    const image = img;
    const canvas = this.canvasDraw;
    const ctx = canvas.getContext('2d');
    const canvasSize = param;

    let ratio = null;
    if (image.width > canvas.width || image.height > canvas.height) {
      const imgParam = (image.width > image.height) ? image.width : image.height;
      ratio = canvasSize / imgParam;
      image.width *= ratio;
      image.height *= ratio;
    } else if (image.width < canvas.width && image.height < canvas.height) {
      ratio = canvasSize / image.width;
      image.width *= ratio;
      image.height *= ratio;
    }

    const startPointDrawWidth = (canvasSize - image.width) / 2;
    const startPointDrawHeight = (canvasSize - image.height) / 2;
    ctx.drawImage(image, startPointDrawWidth, startPointDrawHeight, image.width, image.height);
    this.imgSave = canvas.toDataURL();

    const defaultSize = 512;
    if (this.size !== defaultSize) this.reDrawCanvas(this.size);
  }

  getCoordinate(evt) {
    const canvas = this.canvasDraw;

    const moveX = evt.pageX - canvas.offsetLeft;
    const moveY = evt.pageY - canvas.offsetTop;

    const dotShiftX = moveX % this.line;
    const dotShiftY = moveY % this.line;

    const dotX = moveX - dotShiftX;
    const dotY = moveY - dotShiftY;

    return {
      dotX,
      dotY,
    };
  }

  pencil(e) {
    const canvas = this.canvasDraw;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = this.color;

    const letDraw = (evt) => {
      const coord = this.getCoordinate(evt);
      this.startX = coord.dotX;
      this.startY = coord.dotY;
      ctx.fillRect(coord.dotX, coord.dotY, this.line, this.line);
    };
    letDraw(e);

    const bresenham = this.bresenham.bind(this);

    const remove = () => {
      this.canvasDraw.removeEventListener('mousemove', bresenham);
      document.removeEventListener('mouseup', remove);
    };
    this.canvasDraw.addEventListener('mousemove', bresenham);
    document.addEventListener('mouseup', remove);
  }

  // Bresenham's line algorithm
  bresenham(e) {
    const ctx = this.canvasDraw.getContext('2d');
    ctx.fillStyle = this.color;
    const lineFat = this.line;
    const coord = this.getCoordinate(e);

    let dirX = coord.dotX - this.startX;
    let dirY = coord.dotY - this.startY;
    const lineX = Math.abs(dirX / lineFat);
    const lineY = Math.abs(dirY / lineFat);

    let pointX = this.startX;
    let pointY = this.startY;

    const dir = +lineFat;

    dirX = (dirX > 0) ? dir : -dir;
    dirY = (dirY > 0) ? dir : -dir;

    let ratio = Math.abs(coord.dotY - this.startY) / Math.abs(coord.dotX - this.startX);
    let direction = lineX;

    if (lineX < lineY) {
      direction = lineY;
      ratio = Math.abs(coord.dotX - this.startX) / Math.abs(coord.dotY - this.startY);
    }

    const tempVal = Math.trunc(ratio);
    ratio -= tempVal;

    let breakLine = 0;

    if (lineX >= lineY) {
      for (let i = 0; i < direction; i += 1) {
        breakLine += ratio;
        pointX += dirX;

        if (breakLine >= 0.5) {
          pointY += dirY;
          breakLine -= 1;
        }

        if (this.tool === 'eraser') {
          const eraseCoord = {
            pointX,
            pointY,
          };
          this.eraserTool(eraseCoord);
        } else {
          ctx.fillRect(pointX, pointY, lineFat, lineFat);
        }
      }
    } else {
      for (let i = 0; i < direction; i += 1) {
        breakLine += ratio;
        pointY += dirY;

        if (breakLine >= 0.5) {
          pointX += dirX;
          breakLine -= 1;
        }

        if (this.tool === 'eraser') {
          const eraseCoord = {
            pointX,
            pointY,
          };
          this.eraserTool(eraseCoord);
        } else {
          ctx.fillRect(pointX, pointY, lineFat, lineFat);
        }
      }
    }

    this.startX = pointX;
    this.startY = pointY;
  }

  bucketTool(e) {
    const dot = this.line;
    const canvas = this.canvasDraw;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = this.color;

    let touchX = e.pageX - canvas.offsetLeft;
    let touchY = e.pageY - canvas.offsetTop;

    const pixelDefault = ctx.getImageData(touchX, touchY, 1, 1).data.join('');
    const toCompareData = ctx.getImageData(touchX, touchY, 1, 1).data.join(', ');
    const currentColor = this.color;
    const toCompareColor = `${currentColor.slice(4, -1)}, 255`;
    if (toCompareData === toCompareColor) return;

    const shiftX = touchX % dot;
    const shiftY = touchY % dot;
    touchX -= shiftX;
    touchY -= shiftY;
    const pixelStack = [[touchX, touchY]];

    const checkPixel = (posX, posY) => {
      const chekX = posX;
      const chekY = posY;
      const nextPixel = ctx.getImageData(chekX, chekY, 1, 1).data.join('');
      return nextPixel === pixelDefault;
    };

    const paintPixel = (posX, posY) => {
      ctx.fillRect(posX, posY, dot, dot);
    };

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      // GO UP
      do {
        y -= dot;
      } while (y >= 0 && checkPixel(x, y));
      y += dot;

      let reachRight = false;
      let reachLeft = false;
      do {
        paintPixel(x, y);
        //  LOOK to the RIGHT
        if (x < canvas.width) {
          if (checkPixel(x + dot, y)) {
            if (!reachRight) {
              pixelStack.push([x + dot, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        //  LOOK to the LEFT
        if (x > 0) {
          if (checkPixel(x - dot, y)) {
            if (!reachLeft) {
              pixelStack.push([x - dot, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        y += dot;
      } while ((checkPixel(x, y)) && (y !== canvas.height));
    }
  }

  colorPicker(e) {
    const dotX = e.pageX - this.canvasDraw.offsetLeft;
    const dotY = e.pageY - this.canvasDraw.offsetTop;
    const ctx = this.canvasDraw.getContext('2d');
    const pixelData = ctx.getImageData(dotX, dotY, 1, 1).data;
    return pixelData;
  }

  static clearCanvas() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  static grabImg() {
    const canvas = document.querySelector('canvas');
    const canvasImg = canvas.toDataURL();
    return canvasImg;
  }

  static putCanvas(data) {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
    image.src = data;
  }
}
