
let score = 0;
let lastClickTime = 0;
let gameRunning = false;
let gameTimer;
const target = document.getElementById('target');
const scoreValue = document.getElementById('score-value');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');

function startGame() {
    score = 0;
    scoreValue.textContent = score;
    gameContainer.style.display = 'block'; // Show the game container
    startButton.disabled = true; // Disable the start button during the game
    gameRunning = true;
    moveTarget(); // Move the target for the first time
    
    // Start the 30-second timer
    gameTimer = setTimeout(endGame, 20000); // 20000 milliseconds = 20 seconds
}

function moveTarget() {
    if (!gameRunning) return; // Prevent target movement after the game ends

    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;
    const targetSize = target.clientWidth;

    const randomX = Math.floor(Math.random() * (containerWidth - targetSize));
    const randomY = Math.floor(Math.random() * (containerHeight - targetSize));

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;

    // Measure reaction time
    const currentTime = new Date().getTime();
    if (lastClickTime !== 0) {
        const reactionTime = currentTime - lastClickTime;
        updateScore(reactionTime);
    }
    lastClickTime = currentTime;
}

function updateScore(reactionTime) {
    score += Math.max(0, 1000 - reactionTime); // Example scoring system
    scoreValue.textContent = score;
}

function endGame() {
    gameRunning = false;
    startButton.disabled = false; // Re-enable the start button
    gameContainer.style.display = 'none'; // Hide the game container
    alert(`Game Over! Your final score is ${score}`);
}

startButton.addEventListener('click', startGame);
target.addEventListener('click', moveTarget);