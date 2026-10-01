const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const finalHighScoreDisplay = document.getElementById('finalHighScore');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 1;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let nextDx = 1;
let nextDy = 0;
let gameLoopId;

highScoreDisplay.textContent = highScore;

function drawGame() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawSnake();
    drawFood();
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = '#00cc66';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });
    ctx.shadowBlur = 0;
}

function drawFood() {
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function generateFood() {
    let newFood;
    let valid = false;
    
    while (!valid) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        valid = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    
    food = newFood;
}

function updateSnake() {
    dx = nextDx;
    dy = nextDy;
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    if (checkCollision(head)) {
        endGame();
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision(head) {
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function gameLoop() {
    if (!gamePaused) {
        updateSnake();
        drawGame();
    }
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        gameLoopId = setInterval(gameLoop, 100);
    }
}

function pauseGame() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    }
}

function resetGame() {
    gameRunning = false;
    gamePaused = false;
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15};
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    gameOverScreen.classList.add('hidden');
    clearInterval(gameLoopId);
    drawGame();
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoopId);
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }
    
    finalScoreDisplay.textContent = score;
    finalHighScoreDisplay.textContent = highScore;
    gameOverScreen.classList.remove('hidden');
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function handleKeyPress(e) {
    if (!gameRunning) return;
    
    const key = e.key.toLowerCase();
    
    switch(key) {
        case 'arrowup':
        case 'w':
            if (dy === 0) {
                nextDx = 0;
                nextDy = -1;
                e.preventDefault();
            }
            break;
        case 'arrowdown':
        case 's':
            if (dy === 0) {
                nextDx = 0;
                nextDy = 1;
                e.preventDefault();
            }
            break;
        case 'arrowleft':
        case 'a':
            if (dx === 0) {
                nextDx = -1;
                nextDy = 0;
                e.preventDefault();
            }
            break;
        case 'arrowright':
        case 'd':
            if (dx === 0) {
                nextDx = 1;
                nextDy = 0;
                e.preventDefault();
            }
            break;
    }
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
document.addEventListener('keydown', handleKeyPress);

drawGame();
