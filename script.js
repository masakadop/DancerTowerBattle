const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");

const SHEET_COLS = 5;
const SHEET_ROWS = 5;
const pieces = [];
const gravity = 0.22;
let score = 0;
let timeLeft = 60;
let running = false;
let paused = false;
let timer = null;

const sprite = new Image();
sprite.src = "assets/dancers-sheet.png";

const active = {
  x: canvas.width / 2,
  y: 90,
  w: 92,
  h: 128,
  vx: 1.7,
  drift: 1,
  frame: 0,
};

function reset() {
  pieces.length = 0;
  score = 0;
  timeLeft = 60;
  running = true;
  paused = false;
  active.x = canvas.width / 2;
  active.y = 90;
  active.vx = 1.7;
  active.drift = 1;
  active.frame = randFrame();
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(() => {
    if (!running || paused) return;
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      running = false;
      clearInterval(timer);
    }
  }, 1000);
}

function randFrame() {
  return Math.floor(Math.random() * SHEET_COLS * SHEET_ROWS);
}

function frameRect(index) {
  const fw = sprite.width / SHEET_COLS;
  const fh = sprite.height / SHEET_ROWS;
  const col = index % SHEET_COLS;
  const row = Math.floor(index / SHEET_COLS);
  return { sx: col * fw, sy: row * fh, sw: fw, sh: fh };
}

function update() {
  if (!running || paused) return;
  active.x += active.vx * active.drift;
  if (active.x < 60 || active.x > canvas.width - 60) active.drift *= -1;

  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    p.vy += gravity;
    p.y += p.vy;

    if (p.y + p.h / 2 >= canvas.height - 10) {
      p.y = canvas.height - 10 - p.h / 2;
      p.vy = 0;
      p.resting = true;
    }

    for (let j = 0; j < pieces.length; j++) {
      if (i === j) continue;
      const q = pieces[j];
      if (!q.resting) continue;
      const closeX = Math.abs(p.x - q.x) < (p.w + q.w) * 0.35;
      const onTop = p.y + p.h / 2 >= q.y - q.h / 2 && p.y < q.y;
      if (closeX && onTop) {
        p.y = q.y - q.h / 2 - p.h / 2;
        p.vy = 0;
        p.resting = true;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of pieces) {
    drawSprite(p.frame, p.x, p.y, p.w, p.h, p.resting ? 1 : 0.95);
  }

  if (running) {
    drawSprite(active.frame, active.x, active.y, active.w, active.h, 1);
  }

  if (!running) {
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FINISH!", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "24px sans-serif";
    ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  }
}

function drawSprite(frame, x, y, w, h, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (sprite.complete && sprite.naturalWidth > 0) {
    const r = frameRect(frame);
    ctx.drawImage(sprite, r.sx, r.sy, r.sw, r.sh, x - w / 2, y - h / 2, w, h);
  } else {
    ctx.fillStyle = "#ff7ed4";
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.fillStyle = "#1f0034";
    ctx.fillText("DANCER", x, y);
  }
  ctx.restore();
}

function drop() {
  if (!running || paused) return;
  pieces.push({
    x: active.x,
    y: active.y,
    w: active.w,
    h: active.h,
    vy: 2.4,
    resting: false,
    frame: active.frame,
  });
  score += 10;
  scoreEl.textContent = score;

  active.frame = randFrame();
  active.x = canvas.width / 2;
  active.drift = Math.random() > 0.5 ? 1 : -1;
}

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") active.x -= 26;
  if (e.code === "ArrowRight") active.x += 26;
  if (e.code === "Space") drop();
  if (e.code === "KeyP") paused = !paused;
});

startBtn.addEventListener("click", reset);

function tick() {
  update();
  draw();
  requestAnimationFrame(tick);
}

reset();
tick();
