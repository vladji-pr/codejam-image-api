import Control from './Control';
import Canvas from './Canvas';

export default class Storage {
  constructor(canvas) {
    this.control = new Control(canvas);
    this.canvas = canvas;
    this.localStore = {};
  }

  logic() {
    const start = this.control;
    const store = this.localStore;

    if (localStorage.getItem('storePalette')) {
      start.logic();

      const storeObj = JSON.parse(localStorage.getItem('storePalette'));
      Canvas.putCanvas(storeObj.canvasImg);

      const restoreActiveTool = document.querySelector(`.${storeObj.activeTool}`);
      start.markActiveTool(restoreActiveTool);

      start.currentColor = storeObj.currentColor;
      start.prevColor = storeObj.prevColor;
      start.setActiveColor(start.currentColor);
      this.canvas.line = storeObj.lineFat;
      this.canvas.imgSave = storeObj.imgSave;
    } else {
      start.logic();

      start.markActiveTool(start.currentTool);
      start.setActiveColor(start.currentColor);
    }

    window.addEventListener('beforeunload', () => {
      store.canvasImg = Canvas.grabImg();

      const activeTool = start.currentTool.classList[0];
      store.activeTool = activeTool;

      store.currentColor = start.currentColor;
      store.prevColor = start.prevColor;
      store.lineFat = this.canvas.line;
      store.imgSave = this.canvas.imgSave;

      const storeObj = JSON.stringify(store);
      localStorage.setItem('storePalette', storeObj);
    });
  }
}
