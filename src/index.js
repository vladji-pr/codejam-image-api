import Canvas from './components/Canvas';
import Storage from './components/Storage';
import ImgLoader from './components/ImgLoader';
// import CanvasSize from './components/CanvasSize';
import './scss/style.css';

const canvas = new Canvas();

const start = new Storage(canvas);
start.logic();

const imageApi = new ImgLoader(canvas);
imageApi.logic();

// const canvasControl = new CanvasSize();
// canvasControl.logic();
