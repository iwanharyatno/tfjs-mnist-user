const canvas = document.querySelector('#drawingCanvas');
const clearCanvasButton = document.querySelector('#clearCanvasButton');
const predictionRankList = document.querySelector('#predictionRankList');

const calculatedWidth = canvas.getBoundingClientRect().width;

canvas.style.height = calculatedWidth + 'px';

canvas.width = calculatedWidth;
canvas.height = calculatedWidth;

const gridSize = 28;

let grid = new Array(gridSize).fill(0);
clear();

const pixelWidth = canvas.clientWidth / grid[0].length;
const pixelHeight = canvas.clientHeight / grid.length;

function getRowColIndexFromCoord(x, y) {
  const colIndex = Math.floor(x / pixelWidth);
  const rowIndex = Math.floor(y / pixelHeight);

  return [rowIndex, colIndex];
}

function fillPixel(x, y, brightness) {
  const [rowIndex, colIndex] = getRowColIndexFromCoord(x, y);

  if (rowIndex < gridSize && colIndex < gridSize) grid[rowIndex][colIndex] += brightness;
  
  if (rowIndex < gridSize - 1) grid[rowIndex + 1][colIndex] += brightness / 2;
  if (colIndex < gridSize - 1) grid[rowIndex][colIndex + 1] += brightness / 2;
  if (colIndex < gridSize - 1 && rowIndex < gridSize - 1) grid[rowIndex + 1][colIndex + 1] += brightness / 2;

  if (rowIndex > 0) {
    grid[rowIndex - 1][colIndex] += brightness / 2;
    if (colIndex < gridSize - 1) grid[rowIndex - 1][colIndex + 1] += brightness / 2;
  }
  if (colIndex > 0) {
    grid[rowIndex][colIndex - 1] += brightness / 2;
    if (rowIndex < gridSize - 1) grid[rowIndex + 1][colIndex - 1] += brightness / 2;
  }
  if (colIndex > 0 && rowIndex > 0) {
    grid[rowIndex - 1][colIndex - 1] += brightness / 2;
  }
}

function renderCanvas(pixels) {
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  for (let rowIndex = 0; rowIndex < pixels.length; rowIndex++) {
    for (let colIndex = 0; colIndex < pixels[rowIndex].length; colIndex++) {
      const brightness = Math.min(pixels[rowIndex][colIndex] * 255, 255);

      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      ctx.fillRect(pixelWidth * colIndex, pixelHeight * rowIndex, pixelWidth, pixelHeight);
    }
  }
}

function performDrawing(event) {
  const x = event.touches[0].clientX - canvas.getBoundingClientRect().x;
  const y = event.touches[0].clientY - canvas.getBoundingClientRect().y;

  fillPixel(x, y, 100/255);
  renderCanvas(grid);
}

function clear() {
  grid = grid.map(() => new Array(28).fill(0));
}

renderCanvas(grid);

canvas.addEventListener('touchstart', performDrawing);
canvas.addEventListener('touchmove', performDrawing);

clearCanvasButton.addEventListener('click', () => {
  clear();
  renderCanvas(grid);
});
