let score = 0;
let lastClickTime = 0;
let gameRunning = false;
let gameTimer;

let reactionStartTime;
let reactionBoxClickable = false;
let reactionTimeout;

let sequence = [];
let playerSequence = [];
let symbols = ['■', '▲', '●', '✖']; //square, triangle, circle, x
let timeLeft = 10;
let timerInterval;
let sequenceLength = 4; // Initial sequence length

const target = document.getElementById('target');
const scoreValue = document.getElementById('score-value');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const controls = document.getElementById('controls');
const mainMenu = document.getElementById('main-menu');
const returnMenuButton = document.getElementById('return-menu-button');
const aimTrainerInstructions = document.getElementById('aim-trainer-instructions');

const reactionBox = document.getElementById('reaction-box');
const reactionTimeDisplay = document.getElementById('reaction-time');
const reactionRestartButton = document.getElementById('reaction-restart-button');
const reactionReturnMenuButton = document.getElementById('reaction-return-menu-button');
const reactionContainer = document.getElementById('reaction-container');
const reactionInstructions = document.getElementById('reaction-instructions');

const sequenceDisplay = document.getElementById('sequence');
const timeLeftDisplay = document.getElementById('time-left');
const symbolButtons = document.querySelectorAll('.symbol-button');

// Function to start the Aim Trainer game from the main menu
function startAimTrainer() {
    mainMenu.style.display = 'none'; // Hide the main menu
    gameContainer.style.display = 'block'; // Show the game container
    controls.style.display = 'block'; // Show the controls
    returnMenuButton.style.display = 'none'; // Hide return to menu button at the start
}

function startGame() {
    score = 0;
    scoreValue.textContent = score;
    startButton.disabled = true; // Disable start button while game is running
    gameRunning = true;
    aimTrainerInstructions.style.display = 'none'; // Hides instructions
    moveTarget();

    // Clear any previous timer to avoid conflicts
    if (gameTimer) clearTimeout(gameTimer);
    gameTimer = setTimeout(endAimTrainerGame, 20000); // 20-second timer
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

function endAimTrainerGame() {
    gameRunning = false;
    startButton.disabled = false; // Re-enable the start button
    clearTimeout(gameTimer); // Ensure the timer is cleared
    alert(`Game Over! Your final score is ${score}`);
    returnMenuButton.style.display = 'block'; // Show return to menu button after the game ends
}

function returnToMainMenu() {
    gameContainer.style.display = 'none'; // Hide the game container
    controls.style.display = 'none'; // Hide the controls
    mainMenu.style.display = 'flex'; // Show the main menu
    returnMenuButton.style.display = 'none'; // Hide the return to menu button
}

startButton.addEventListener('click', startGame);
target.addEventListener('click', moveTarget);
returnMenuButton.addEventListener('click', returnToMainMenu);

// Function to start the Reaction Test game from the main menu
function startReactionTest() {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'none';
    controls.style.display = 'none';
    reactionContainer.style.display = 'flex';
    reactionRestartButton.style.display = 'none';
    reactionReturnMenuButton.style.display = 'none';
    startReactionGame();
}

function startReactionGame() {
    reactionTimeDisplay.textContent = 0;
    reactionBox.style.backgroundColor = 'red';
    reactionBoxClickable = false;
    reactionInstructions.textContent = "Click the box as fast as you can when it turns green!"; // Reset

    // Set a random delay between 4 to 12 seconds (4000ms to 12000ms)
    const randomDelay = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;

    reactionTimeout = setTimeout(() => {
        reactionBox.style.backgroundColor = 'green';
        reactionStartTime = new Date().getTime();
        reactionBoxClickable = true; // Now the box can be clicked
    }, randomDelay);
}

function endReactionGame() {
    reactionBoxClickable = false;
    clearTimeout(reactionTimeout);
    reactionRestartButton.style.display = 'block'; // Show start again button
    reactionReturnMenuButton.style.display = 'block'; // Show return to menu button
}

// Event listener for clicking the reaction box
reactionBox.addEventListener('click', function() {
    if (reactionBoxClickable) {
        const currentTime = new Date().getTime();
        const reactionTime = currentTime - reactionStartTime;
        reactionTimeDisplay.textContent = reactionTime;
        alert(`Your reaction time is ${reactionTime} ms!`);
        endReactionGame();
    } else {
        // Change instructions to indicate the player clicked too fast
        reactionInstructions.textContent = "Oops, you clicked too fast!";
        alert('You clicked too early! Game Over.');
        endReactionGame();
    }
});

// Start the game again
reactionRestartButton.addEventListener('click', function() {
    reactionRestartButton.style.display = 'none';
    reactionReturnMenuButton.style.display = 'none';
    startReactionGame(); // Restart the game
});

// Return to main menu from reaction test
reactionReturnMenuButton.addEventListener('click', function() {
    reactionContainer.style.display = 'none';
    mainMenu.style.display = 'flex'; // Show the main menu
});

// Start the Symbol Sequence game
function startSymbolSequence() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('symbol-sequence-game').style.display = 'flex';
    startNewRound();
    document.getElementById('symbol-restart-button').style.display = 'none';
}

function startNewRound() {
    // Generate random sequence
    sequence = generateRandomSequence(sequenceLength);
    displaySequence(sequence);
    playerSequence = [];
    resetTimer();
    document.getElementById('symbol-restart-button').style.display = 'none';
}

function generateRandomSequence(length) {
    const sequence = [];
    for (let i = 0; i < length; i++) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        sequence.push(randomSymbol);
    }
    return sequence;
}

function displaySequence(sequence) {
    sequenceDisplay.textContent = sequence.join(' -> ');
}

symbolButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const symbolClicked = e.target.innerText; // Get the symbol from inner text
        playerSequence.push(symbolClicked);
        checkPlayerSequence();
    });
});

function checkPlayerSequence() {
    // Compare the player's sequence with the correct one
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== sequence[i]) {
            alert('Wrong sequence! You made it through ' + (sequenceLength - 4) + ' stages!');
            sequenceLength = 4;
            endSymbolSequenceGame();
            return;
        }
    }

    if (playerSequence.length === sequence.length) {
        alert('Correct sequence! Get ready for the next round!');
        sequenceLength++;
        startNewRound();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 10; // 10-second timer
    timeLeftDisplay.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            alert('You ran out of time! You made it through ' + (sequenceLength - 4) + ' stages!');
            endSymbolSequenceGame();
        }
    }, 1000); //part of time
}

function endSymbolSequenceGame() {
    clearInterval(timerInterval);
    document.getElementById('symbol-restart-button').style.display = 'block';
    document.getElementById('symbol-return-menu-button').style.display = 'block';
}

document.getElementById('symbol-return-menu-button').addEventListener('click', () => {
    document.getElementById('symbol-sequence-game').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
});

document.getElementById('symbol-restart-button').addEventListener('click', function() {
    document.getElementById('symbol-restart-button').style.display = 'none'; // Hide restart button
    startNewRound(); // Restart the game
});
