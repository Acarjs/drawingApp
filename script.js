const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEl = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const undo = document.getElementById('undo');
const redo = document.getElementById('redo');

let ctx = canvas.getContext('2d');
let size = 10;
let color = 'black';
let isPressed = false;
let x;
let y;
let restore_array = [];
let index = -1;
let undoList = [];
let isPrevUndo = false;

canvas.addEventListener('mousedown', e => {
  isPressed = true;

  x = e.offsetX;
  y = e.offsetY;
});

canvas.addEventListener('mouseup', e => {
  isPressed = false;

  x = undefined;
  y = undefined;

  restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;
  undo.disabled = false;
});

canvas.addEventListener('mousemove', e => {
  const x2 = e.offsetX;
  const y2 = e.offsetY;
  if (isPressed) {
    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);

    x = x2;
    y = y2;
  }
});

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
}

function updateSizeOnScreen() {
  sizeEl.innerText = `${size}`;
}

increaseBtn.addEventListener('click', () => {
  size += 5;

  if (size > 50) {
    size = 0;
  }

  updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
  size -= 5;

  if (size <= 5) {
    size = 5;
  }

  updateSizeOnScreen();
});

clearEl.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  restore_array = [];
  undoList = [];
  index = -1;
  redo.disabled = true;
  undo.disabled = true;
});

colorEl.addEventListener('change', e => (color = e.target.value));

undo.addEventListener('click', () => {
  if (index <= 0) {
    isPrevUndo = true;
    undoList.push(restore_array[0]);
    undo.disabled = true;
    redo.disabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    restore_array = [];
    index = -1;
  } else {
    isPrevUndo = true;
    index--;
    undo.disabled = false;
    redo.disabled = false;
    undoList.push(restore_array[restore_array.length - 1]);
    restore_array.pop();
    ctx.putImageData(restore_array[index], 0, 0);
  }
});

redo.addEventListener('click', () => {
  if (isPrevUndo && undoList.length !== 0) {
    index++;
    restore_array.push(undoList[undoList.length - 1]);
    undo.disabled = false;
    redo.disabled = false;
    undoList.pop();
    ctx.putImageData(restore_array[restore_array.length - 1], 0, 0);
  } else {
    ctx.putImageData(restore_array[index], 0, 0);
    redo.disabled = true;
  }
});
