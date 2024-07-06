const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDiv = document.getElementById("score");
let score = 0;
let running = true;

class GameObject {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Player extends GameObject {
  // Код, специфичный для игрока, можно добавить здесь
}

class Asteroid extends GameObject {
  // Код, специфичный для астероидов, можно добавить здесь
}

class Bullet extends GameObject {
  // Код, специфичный для пуль, можно добавить здесь
}

const player = new Player(400, 550, 50, 50, "white");
const asteroids = [];
const bullets = [];

function spawnAsteroid() {
  const asteroid = new Asteroid(Math.random() * 750, 0, 50, 50, "gray");
  asteroids.push(asteroid);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    player.x -= 10; // Движение влево
  } else if (event.key === "ArrowRight") {
    player.x += 10; // Движение вправо
  } else if (event.key === " ") {
    const bullet = new Bullet(
      player.x + player.width / 2 - 2.5,
      player.y,
      5,
      10,
      "white"
    );
    bullets.push(bullet);
  }
});

function update() {
  if (!running) return;

  // Обновление позиции пуль
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= 5;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }

  // Проверка столкновений между пулями и астероидами
  for (let b = 0; b < bullets.length; b++) {
    for (let a = 0; a < asteroids.length; a++) {
      if (
        bullets[b].x < asteroids[a].x + asteroids[a].width &&
        bullets[b].x + bullets[b].width > asteroids[a].x &&
        bullets[b].y < asteroids[a].y + asteroids[a].height &&
        bullets[b].y + bullets[b].height > asteroids[a].y
      ) {
        bullets.splice(b, 1);
        asteroids.splice(a, 1);
        score++;
        scoreDiv.textContent = "Очки: " + score;
        spawnAsteroid();
        break;
      }
    }
  }

  // Проверка столкновений между игроком и астероидами
  for (let a = 0; a < asteroids.length; a++) {
    if (
      player.x < asteroids[a].x + asteroids[a].width &&
      player.x + player.width > asteroids[a].x &&
      player.y < asteroids[a].y + asteroids[a].height &&
      player.y + player.height > asteroids[a].y
    ) {
      running = false;
      alert("Игра окончена! Итоговый счет: " + score);
    }
  }

  // Очистка холста
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовка всех игровых объектов
  player.draw();
  asteroids.forEach((asteroid) => asteroid.draw());
  bullets.forEach((bullet) => bullet.draw());

  requestAnimationFrame(update);
}

// Запуск игрового цикла
spawnAsteroid();
update();
