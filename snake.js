const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeColor = "#EE82EE"; // Pink color for the snake
const snakeBorderColor = "#ff1493"; // Darker pink border
const snakeHeadImgSrc = "Photos/simone.png"; // Replace with your image path
const foodImages = [
    "Photos/drink1.png", // Replace with your image paths
    "Photos/drink2.png",
    "Photos/drink3.png"
];

const gridSize = 60; // Increased grid size for zoomed-in effect
canvas.width = gridSize * 10; // Adjusted to fit larger grid
canvas.height = gridSize * 10;

let snake = [];
let direction = { x: 0, y: 0 };
let food = {};
let foodImg = new Image();
let snakeHeadImg = new Image();
let score = 0;
let game;

document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

const startButton = document.getElementById("start-button");
const startScreen = document.getElementById("start-screen");
const gameOverDiv = document.getElementById("game-over");
const finalScoreSpan = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);

function initGame() {
    snake = [
        { x: 5 * gridSize, y: 5 * gridSize }
    ];
    direction = { x: gridSize, y: 0 };
    food = { x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize, y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize };
    foodImg.src = foodImages[Math.floor(Math.random() * foodImages.length)];
    snakeHeadImg.src = snakeHeadImgSrc;
    score = 0;
    document.getElementById("score").innerText = "Score: " + score;
}

function startGame() {
    startScreen.style.display = "none";
    canvas.style.display = "block";
    document.getElementById("score").style.display = "block";

    initGame();
    game = setInterval(gameLoop, 190);
}

function resetGame() {
    gameOverDiv.style.display = "none";
    startGame();
}

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            // Left swipe
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
        } else {
            // Right swipe
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
        }
    } else {
        if (yDiff > 0) {
            // Up swipe
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
        } else {
            // Down swipe
            if (direction.y === 0) direction = { x: 0, y: gridSize };
        }
    }
    xDown = null;
    yDown = null;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = direction.y === -gridSize;
    const goingDown = direction.y === gridSize;
    const goingLeft = direction.x === -gridSize;
    const goingRight = direction.x === gridSize;

    if (keyPressed === 37 && !goingRight) {
        direction = { x: -gridSize, y: 0 };
    }
    if (keyPressed === 38 && !goingDown) {
        direction = { x: 0, y: -gridSize };
    }
    if (keyPressed === 39 && !goingLeft) {
        direction = { x: gridSize, y: 0 };
    }
    if (keyPressed === 40 && !goingUp) {
        direction = { x: 0, y: gridSize };
    }
}

function drawCheckeredBackground() {
    const lighterPink = "#ffc0cb";
    const darkerPink = "#ff69b4";

    for (let y = 0; y < canvas.height / gridSize; y++) {
        for (let x = 0; x < canvas.width / gridSize; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? lighterPink : darkerPink;
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
    }
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        if (i === 0 && snakeHeadImg.complete) {
            ctx.drawImage(snakeHeadImg, snake[i].x, snake[i].y, gridSize, gridSize);
        } else {
            ctx.fillStyle = snakeColor;
            ctx.strokestyle = snakeBorderColor;
            ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
            ctx.strokeRect(snake[i].x, snake[i].y, gridSize, gridSize);
        }
    }
}

function drawFood() {
    ctx.drawImage(foodImg, food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        food = { x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize, y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize };
        foodImg.src = foodImages[Math.floor(Math.random() * foodImages.length)];
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || collision()) {
        clearInterval(game);

        // Display game over message with score
        endGame(score);
    }
}

function collision() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCheckeredBackground();
    drawFood();
    moveSnake();
    drawSnake();
}

function endGame(score) {
    finalScoreSpan.textContent = score;
    gameOverDiv.style.display = "block";
}
