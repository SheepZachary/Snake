const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highscoreElement = document.querySelector(".high-score");
const speedButton = document.getElementById("speed-button");
const speedInput = document.getElementById("speed-input");

let foodPositions = [];
let snakeX = 2, snakeY = 2;
let setIntervalId;
let velocityX = 0, velocityY = 0;
let gameOver = false;
let snakeBodyArray = [];
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;

highscoreElement.innerHTML = "High Score: " + highScore;

function gameLoop() {
    if (gameOver) {
        handleGameOver();
    }

    foodPositions.forEach((food, index) => {
        if (snakeX === food.x && snakeY === food.y) {
            foodPositions.splice(index, 1);
            snakeBodyArray.push([food.x, food.y]);
            score++;
            scoreElement.innerHTML = "Score:" + score;

            if (score > highScore) {
                highScore = score;
            }
            localStorage.setItem("high-score", highScore);
            highscoreElement.innerHTML = "High Score:" + highScore;
        }
    });

    if (foodPositions.length === 0) {
        randomizeFood();
    }

    let html = foodPositions.map(food => `<div class="food" style="grid-area: ${food.y} / ${food.x}"></div>`).join('');

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBodyArray.length - 1; i > 0; i--) {
        snakeBodyArray[i] = snakeBodyArray[i - 1];
    }

    snakeBodyArray[0] = [snakeX, snakeY];

    snakeBodyArray.forEach((snakePart, index) => {
        html += `<div class="player" style="grid-area: ${snakePart[1]} / ${snakePart[0]}"></div>`;
        if (index > 0 && snakeX == snakePart[0] && snakeY == snakePart[1]) {
            gameOver = true;
        }
    });

    if (snakeX < 0 || snakeX > 30 || snakeY < 0 || snakeY > 30) {
        return gameOver = true;
    }

    playBoard.innerHTML = html;
}

function randomizeFood() {
    foodPositions = [];
    while (foodPositions.length < 3) {
        const newX = Math.floor(Math.random() * 30) + 1;
        const newY = Math.floor(Math.random() * 30) + 1;
        if (!foodPositions.some(food => food.x === newX && food.y === newY)) {
            foodPositions.push({ x: newX, y: newY });
        }
    }
}

const changeDirection = e => {
    if ((e.key === "w" || e.key === "ArrowUp") && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if ((e.key === "s" || e.key === "ArrowDown") && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if ((e.key === "a" || e.key === "ArrowLeft") && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if ((e.key === "d" || e.key === "ArrowRight") && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("GAME OVER!!!!!!! Press OK to replay");
    location.reload();
}

speedButton.addEventListener("click", () => {
    const newSpeed = parseInt(speedInput.value);
    if (!isNaN(newSpeed) && newSpeed > 0) {
        clearInterval(setIntervalId);
        setIntervalId = setInterval(gameLoop, newSpeed);
    } else {
        alert("Please enter a valid speed in milliseconds.");
    }
});

randomizeFood();
setIntervalId = setInterval(gameLoop, 99);
document.addEventListener("keyup", changeDirection);