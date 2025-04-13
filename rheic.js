const canvas = document.getElementById("rheic-bg");
const ctx = canvas.getContext("2d");

let width, height;
let cols = 100, rows = 100;
let grid = [];
let next = [];
let energy = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function init() {
  for (let i = 0; i < cols * rows; i++) {
    grid[i] = 0;
    next[i] = 0;
    energy[i] = Math.random() * 0.05;
  }
}
init();

function index(x, y) {
  return y * cols + x;
}

function update() {
  for (let x = 1; x < cols - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let i = index(x, y);
      let grad = Math.abs(grid[index(x + 1, y)] - grid[index(x - 1, y)])
                + Math.abs(grid[index(x, y + 1)] - grid[index(x, y - 1)]);
      let dC = 0.5 * grad + 0.6 * energy[i] - 0.02 * grid[i];
      next[i] = Math.max(0, Math.min(1, grid[i] + dC));
      energy[i] *= 0.99;
    }
  }

  // swap buffers
  [grid, next] = [next, grid];
}

function draw() {
  let cellWidth = width / cols;
  let cellHeight = height / rows;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let i = index(x, y);
      let c = grid[i];
      let hue = (c * 0.4 + Date.now() * 0.00005) % 1;
      ctx.fillStyle = `hsla(${hue * 360}, 100%, ${30 + c * 50}%, ${c})`;
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth + 1, cellHeight + 1);
    }
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

canvas.addEventListener("mousemove", (e) => {
  let rect = canvas.getBoundingClientRect();
  let x = Math.floor((e.clientX - rect.left) / (rect.width / cols));
  let y = Math.floor((e.clientY - rect.top) / (rect.height / rows));
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      let nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        energy[index(nx, ny)] += 0.2;
      }
    }
  }
});
