const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0 };
let gravity = 0.6;
let lift = -10;
let pipes = [];
let score = 0;

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
}

function update() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    resetGame();
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;

    // Collision
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      resetGame();
    }

    // Score
    if (pipe.x + pipe.width === bird.x) {
      score++;
    }

    // Remove off-screen pipes
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
    }
  });

  // Add new pipes
  if (frames % 100 === 0) {
    let top = Math.random() * 200 + 50;
    let bottom = canvas.height - top - 150;
    pipes.push({ x: canvas.width, width: 50, top: top, bottom: bottom });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  pipes.forEach(drawPipe);
  ctx.fillStyle = "black";
  ctx.font = "24px sans-serif";
  ctx.fillText("Score: " + score, 10, 30);
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frames = 0;
}

function gameLoop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => {
  bird.velocity = lift;
});

let frames = 0;
gameLoop();
