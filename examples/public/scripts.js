//import {blending} from './magicolors.js';
import * as magicolors from './magicolors.js';

var imgA = new Image();
imgA.src = document.getElementById('srcA').src;
var imgB = new Image();
imgB.src = document.getElementById('srcB').src;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

imgA.onload = function() {
    var canvaA = document.createElement('canvas');
    var ctxA = canvaA.getContext('2d');
    canvaA.width = imgA.width;
    canvaA.height = imgA.height;
    ctxA.drawImage(imgA,0,0);

    var canvaB = document.createElement('canvas');
    var ctxB = canvaB.getContext('2d');
    canvaB.width = imgB.width;
    canvaB.height = imgB.height;
    ctxB.drawImage(imgB,0,0);


    var resultImg = magicolors.blending['normal'](ctxA.getImageData(0,0, imgA.width,imgA.height),ctxB.getImageData(0,0, imgB.width,imgB.height))

    canvas.width = resultImg.width+50;
    canvas.height = resultImg.height+50;

    ctx.putImageData(resultImg,25,25);
    imgA.style.display = 'none';
};
