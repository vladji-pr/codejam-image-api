export default class Control {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvasElem = document.querySelector('canvas');
    this.controlPanel = document.querySelector('.control-panel-wrapper');
    this.tools = document.querySelector('.tools-wrapper ul');
    this.palette = document.querySelector('.palette-wrapper');
    this.pencil = document.querySelector('.pencil-tool');
    this.bucket = document.querySelector('.bucket-tool');
    this.colorPicker = document.querySelector('.choose-tool');
    this.currentColorElem = document.querySelector('.color-view_cur input');
    this.prevColorElem = document.querySelector('.color-view_prev');
    this.requestField = document.querySelector('.request-field');
    this.currentTool = this.pencil;
    this.currentColor = '#008800';
    this.prevColor = '#ffbb00';
    this.isPickColor = 0;
    this.chooseColor();
  }

  logic() {
    this.tools.addEventListener('click', (e) => {
      if (e.target.closest('li')) {
        this.markActiveTool(e.target);
      }
    });

    this.palette.addEventListener('click', (e) => {
      if (e.target.closest('li')) {
        const targetBtn = e.target.closest('li');
        const colorIndicator = targetBtn.querySelector('.color-view');
        if (!colorIndicator.classList.contains('color-view_cur')) this.switchColors(colorIndicator);
      }
    });

    this.palette.addEventListener('change', () => {
      this.currentColor = this.currentColorElem.value;
      // shortcut for convert hex to rgb )
      this.currentColorElem.style.backgroundColor = this.currentColorElem.value;
      this.canvas.color = this.currentColorElem.style.backgroundColor;
    });

    const keyToggleTools = (e) => {
      if (e.code === 'KeyP') {
        this.markActiveTool(this.pencil);
      } else if (e.code === 'KeyC') {
        this.markActiveTool(this.colorPicker);
      } else if (e.code === 'KeyB') {
        this.markActiveTool(this.bucket);
      }
    };

    document.addEventListener('keydown', keyToggleTools);

    this.requestField.addEventListener('focus', () => {
      document.removeEventListener('keydown', keyToggleTools);
    });

    this.requestField.addEventListener('blur', () => {
      document.addEventListener('keydown', keyToggleTools);
    });

    document.addEventListener('selectstart', (evt) => {
      evt.preventDefault();
    });
  }

  markActiveTool(tool) {
    const activeTool = tool;
    this.currentTool.classList.remove('active-tool');
    activeTool.classList.add('active-tool');
    this.currentTool = activeTool;
    this.setActiveTool(activeTool);
  }

  setActiveTool(tool) {
    const activeTool = tool.closest('li').classList[0];
    this.canvas.tool = activeTool;

    this.isPickColor = (activeTool === 'choose-tool') ? 1 : 0;
  }

  setActiveColor(newColor) {
    this.currentColorElem.value = newColor;
    this.prevColorElem.style.backgroundColor = this.prevColor;
    this.currentColor = newColor;

    // shortcut for convert hex to rgb )
    this.currentColorElem.style.backgroundColor = newColor;
    this.canvas.color = this.currentColorElem.style.backgroundColor;
  }

  switchColors(colorIndicator) {
    const rgbColor = getComputedStyle(colorIndicator).backgroundColor;
    const hexColor = Control.convertBaseColor(rgbColor);
    this.currentColorElem.value = hexColor;
    this.prevColorElem.style.backgroundColor = this.currentColor;
    this.prevColor = this.currentColor;
    this.currentColor = hexColor;

    this.canvas.color = rgbColor;
  }

  chooseColor() {
    this.canvasElem.addEventListener('click', (e) => {
      if (this.isPickColor) {
        const canvasPixel = this.canvas.colorPicker(e);
        const hexColor = Control.convertBaseColor(canvasPixel);
        this.prevColor = this.currentColor;
        this.setActiveColor(hexColor);
      }
    });
  }

  static convertBaseColor(data) {
    let base = data;
    let hexStr = '';
    if (typeof base === 'string') base = base.slice(4, -1).split(',');

    base.forEach((k, i) => {
      if (i === 3) return;
      let val = k;
      if (typeof val === 'string') val = +val;
      let num = val.toString(16);
      num = (num === '0') ? '00' : String(num);
      hexStr += num;
    });

    hexStr = (hexStr === '000000') ? '#ffffff' : `#${hexStr}`;
    return hexStr;
  }
}
