import ErrorHandler from './Error';

export default class ImgLoader {
  constructor(canvas) {
    this.canvas = canvas;
    this.error = new ErrorHandler();
    this.requestURL = 'https://api.unsplash.com/photos/random?client_id=76e02e7b52a90f9aeedee595901a91ad8a6e98072539f05ba2420e24b6a4fa75&query=town,';
    this.loadBtn = document.querySelector('.btn_load');
    this.requestField = document.querySelector('.request-field');
  }

  logic() {
    this.loadBtn.addEventListener('click', () => {
      this.getData();
      this.canvas.line = 1;
    });
  }

  async getData() {
    let url = this.requestURL;
    const request = this.requestField.value;

    if (request) {
      url = `${url}${request}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          this.imgPrepare(data.urls.small);
        } else {
          throw new Error('Unfortunately we didn\'t get correct answer from the server');
        }
      } catch (e) {
        this.error.badAnswer(e.message);
      }
    }
  }

  imgPrepare(url) {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = url;

    const canvasSize = 512;
    image.addEventListener('load', () => {
      this.canvas.drawImage(canvasSize, image);
    });
  }
}
