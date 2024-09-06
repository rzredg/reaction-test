let score = 0;
let lastClickTime = 0;
let gameRunning = false;
let gameTimer;
const target = document.getElementById('target');
const scoreValue = document.getElementById('score-value');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const controls = document.getElementById('controls');
const mainMenu = document.getElementById('main-menu');

// Function to start the Aim Trainer game from the main menu
function startAimTrainer() {
    mainMenu.style.display = 'none'; // Hide the main menu
    gameContainer.style.display = 'block'; // Show the game container
    controls.style.display = 'block'; // Show the controls
}

function startGame() {
    score = 0;
    scoreValue.textContent = score;
    startButton.disabled = true; // Disable start button while game is running
    gameRunning = true;
    moveTarget();
    gameTimer = setTimeout(endGame, 20000); // 20-second timer
}

function moveTarget() {
    if (!gameRunning) return; // Prevent target from moving if the game has ended

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
    startButton.disabled = false; // Re-enable the start button to allow the user to play again
    alert(`Game Over! Your final score is ${score}`);
}

startButton.addEventListener('click', startGame);
target.addEventListener('click', moveTarget);
