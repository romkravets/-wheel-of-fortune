// import React from 'react';
// import { render } from 'react-dom';

// export const run = () => {
//   render(<h1>Hello world</h1>, document.querySelector('#root'));
// };

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let center = width / 2;
let items = [1, 2, 3, 4, 5, 6];
let itemsCount = items.length;
let itemsDeg = 360 / items.length;
var deg = rand(0, 360);
let speed = 0;
var slowDownRand = 0;
let lock = false;
let start = false;
let stop = false;
let result = false;

function getRadians(degrees) {
  return (Math.PI / 180) * degrees;
}

function drawItem(deg) {
  ctx.beginPath();
  ctx.fillStyle = "#232323";
  ctx.moveTo(center, center);
  ctx.arc(center, center, center, getRadians(deg), getRadians(deg + itemsDeg));
  ctx.lineTo(center, center);
  ctx.fill();
}

function drawText(text) {
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(getRadians(deg + itemsDeg / 2));
  ctx.textAlign = "right";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText(text, 135, 10);
  ctx.restore();
}

function drawImg() {
  ctx.clearRect(0, 0, width, width);
  for (let i = 0; i < items.length; i++) {
    drawItem(deg);
    drawText(items[i]);
    deg = deg + itemsDeg;
  }
}

(function animateWheel() {
  deg += speed;
  deg %= 360;

  // Start rotate
  if (start) {
    speed = speed + 1 * 0.1;

    if (speed > rand(2, 5)) {
      start = false;
      stop = true;
    }
  }
  // Stop rotate
  if (stop) {
    lock = true;
    slowDownRand = rand(0.992, 0.999);
    speed = speed > 0.2 ? (speed *= slowDownRand) : 0;
  }

  // Result
  if (stop && !speed) {
    let res = Math.floor(((360 - deg - 90) % 360) / itemsDeg);
    res = (itemsCount + res) % itemsCount;
    alert("result = " + items[res]);
    stop = false;
  }

  drawImg();
  window.requestAnimationFrame(animateWheel);
})();

document.getElementById("btn").addEventListener(
  "mousedown",
  function () {
    start = true;
  },
  false
);

