document.addEventListener("DOMContentLoaded", () => {
  const gameArena = document.getElementById("game-arena");
  const arenaSize = 600;
  const cellSize = 20;
  let score = 0;
  let gameStarted = false;
  let food = { x: 300, y: 200 };
  let snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
  ];
  let dx = cellSize;
  let dy = 0;

  function drawScoreBoard() {
    const scoreBoard = document.getElementById("score-board");
    scoreBoard.textContent = `Score : ${score}`;
  }

  function drawDiv(x, y, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;
    return div;
  }

  function drawFoodAndSnake() {
    gameArena.innerHTML = "";

    const foodElement = drawDiv(food.x, food.y, "food");
    snake.forEach((snakeCell) => {
      const element = drawDiv(snakeCell.x, snakeCell.y, "snake");
      gameArena.appendChild(element);
    });
    gameArena.appendChild(foodElement);
  }

  function moveFood() {
    let newX, newY;
    do {
      newX =
        Math.floor(Math.random() * ((arenaSize - cellSize) / cellSize)) *
        cellSize;
      newY =
        Math.floor(Math.random() * ((arenaSize - cellSize) / cellSize)) *
        cellSize;
    } while (
      snake.some((snakeCell) => snakeCell.x === newX && snakeCell.y === newY)
    );
    food = { x: newX, y: newY };
  }

  function updateSnake() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
      score += 5;
      moveFood();
    } else {
      snake.pop();
    }
  }

  function isGameOver() {
    for (i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
    }

    //wall collision
    const isHitingLeftWall = snake[0].x < 0;
    const isHitingTopWall = snake[0].y < 0;
    const isHitingRightWall = snake[0].x >= arenaSize - cellSize;
    const isHitingDownWall = snake[0].y >= arenaSize - cellSize;

    return (
      isHitingLeftWall ||
      isHitingTopWall ||
      isHitingRightWall ||
      isHitingDownWall
    );
  }

  function gameLoop() {
    setInterval(() => {
      if (!gameStarted) return;

      if (isGameOver()) {
        gameStarted = false;
        alert(`Game over, Score = ${score}`);
        document.location.reload();
        return;
      }
      updateSnake();
      drawScoreBoard();
      drawFoodAndSnake();
    }, 200);
  }

  function changeDirection(e) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = e.keyCode;

    const isGoingUp = dy === -cellSize;
    const isGoingDown = dy === cellSize;
    const isGoingLeft = dx === -cellSize;
    const isGoingRight = dx === cellSize;

    if (keyPressed === LEFT_KEY && !isGoingRight) {
      dy = 0;
      dx = -cellSize;
    }
    if (keyPressed === RIGHT_KEY && !isGoingLeft) {
      dy = 0;
      dx = cellSize;
    }
    if (keyPressed === UP_KEY && !isGoingDown) {
      dy = -cellSize;
      dx = 0;
    }
    if (keyPressed === DOWN_KEY && !isGoingUp) {
      dy = cellSize;
      dx = 0;
    }
  }

  function runGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameLoop();
      document.addEventListener("keydown", changeDirection);
    }
  }

  function initiateGame() {
    const scoreBoard = document.createElement("div");
    scoreBoard.id = "score-board";
    document.body.insertBefore(scoreBoard, gameArena);

    const startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.classList.add("start-button");
    document.body.appendChild(startButton);

    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      runGame();
    });
  }

  initiateGame();
});
