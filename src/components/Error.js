export default class ErrorHandler {
  constructor() {
    this.errorPosition = document.querySelector('.loader-control');
  }

  badAnswer(message) {
    const div = document.createElement('div');
    const closeBtn = document.createElement('div');
    const text = document.createElement('p');
    div.classList.add('modal-error');
    closeBtn.classList.add('modal-close-btn');

    closeBtn.innerHTML = '&times;';
    text.innerHTML = message;
    div.append(closeBtn, text);
    this.errorPosition.append(div);

    closeBtn.addEventListener('click', () => {
      div.hidden = true;
    });
  }
}
