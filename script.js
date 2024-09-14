// Game variables
let score = 0;
let lastClickTime = 0;
let gameRunning = false;
let gameTimer;

let reactionStartTime;
let reactionBoxClickable = false;
let reactionTimeout;

let sequence = [];
let playerSequence = [];
let symbols = ['■', '▲', '●', '✖'];
let timeLeft = 10;
let timerInterval;
let sequenceLength = 4;

// DOM elements
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

// Function to start the Aim Trainer game
function startAimTrainer() {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    controls.style.display = 'block';
    returnMenuButton.style.display = 'none';
}

function startGame() {
    score = 0;
    scoreValue.textContent = score;
    startButton.disabled = true;
    gameRunning = true;
    aimTrainerInstructions.style.display = 'none';
    moveTarget();

    if (gameTimer) clearTimeout(gameTimer);
    gameTimer = setTimeout(endAimTrainerGame, 20000);
}

function moveTarget() {
    if (!gameRunning) return;

    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;
    const targetSize = target.clientWidth;

    const randomX = Math.floor(Math.random() * (containerWidth - targetSize));
    const randomY = Math.floor(Math.random() * (containerHeight - targetSize));

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;

    const currentTime = new Date().getTime();
    if (lastClickTime !== 0) {
        const reactionTime = currentTime - lastClickTime;
        updateScore(reactionTime);
    }
    lastClickTime = currentTime;
}

function updateScore(reactionTime) {
    score += Math.max(0, 1000 - reactionTime);
    scoreValue.textContent = score;
}

function endAimTrainerGame() {
    gameRunning = false;
    startButton.disabled = false;
    clearTimeout(gameTimer);

    //const playerName = prompt("Enter your name for the leaderboard:");
    //if (playerName) {
       // addScoreToLeaderboard(playerName, score);
    //}
    returnMenuButton.style.display = 'block';
}

function returnToMainMenu() {
    gameContainer.style.display = 'none';
    controls.style.display = 'none';
    mainMenu.style.display = 'flex';
    returnMenuButton.style.display = 'none';
}

startButton.addEventListener('click', startGame);
target.addEventListener('click', moveTarget);
returnMenuButton.addEventListener('click', returnToMainMenu);

// Function to start the Reaction Test game
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
    reactionInstructions.textContent = "Click the box as fast as you can when it turns green!";

    const randomDelay = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;

    reactionTimeout = setTimeout(() => {
        reactionBox.style.backgroundColor = 'green';
        reactionStartTime = new Date().getTime();
        reactionBoxClickable = true;
    }, randomDelay);
}

function endReactionGame() {
    reactionBoxClickable = false;
    clearTimeout(reactionTimeout);

    const playerName = prompt("Enter your name for the leaderboard:");
    if (playerName) {
        const reactionTime = parseInt(reactionTimeDisplay.textContent);
        addScoreToLeaderboard(playerName, reactionTime);
    }
    reactionRestartButton.style.display = 'block';
    reactionReturnMenuButton.style.display = 'block';
}

reactionBox.addEventListener('click', function() {
    if (reactionBoxClickable) {
        const currentTime = new Date().getTime();
        const reactionTime = currentTime - reactionStartTime;
        reactionTimeDisplay.textContent = reactionTime;
        alert(`Your reaction time is ${reactionTime} ms!`);
        endReactionGame();
    } else {
        reactionInstructions.textContent = "Oops, you clicked too fast!";
        alert('You clicked too early! Game Over.');
        endReactionGame();
    }
});

reactionRestartButton.addEventListener('click', function() {
    reactionRestartButton.style.display = 'none';
    reactionReturnMenuButton.style.display = 'none';
    startReactionGame();
});

reactionReturnMenuButton.addEventListener('click', function() {
    reactionContainer.style.display = 'none';
    mainMenu.style.display = 'flex';
});

// Function to start the Symbol Sequence game
function startSymbolSequence() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('symbol-sequence-game').style.display = 'flex';
    startNewRound();
    document.getElementById('symbol-restart-button').style.display = 'none';
}

function startNewRound() {
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
        const symbolClicked = e.target.innerText;
        playerSequence.push(symbolClicked);
        checkPlayerSequence();
    });
});

function checkPlayerSequence() {
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
    timeLeft = 10;
    timeLeftDisplay.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            alert('You ran out of time! You made it through ' + (sequenceLength - 4) + ' stages!');
            endSymbolSequenceGame();
        }
    }, 1000);
}

function endSymbolSequenceGame() {
    clearInterval(timerInterval);
    //const playerName = prompt("Enter your name for the leaderboard:");
    //if (playerName) {
        //addScoreToLeaderboard(playerName, sequenceLength - 1); // Use stages cleared
    //}
    document.getElementById('symbol-restart-button').style.display = 'block';
    document.getElementById('symbol-return-menu-button').style.display = 'block';
}

document.getElementById('symbol-return-menu-button').addEventListener('click', () => {
    document.getElementById('symbol-sequence-game').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
});

document.getElementById('symbol-restart-button').addEventListener('click', function() {
    document.getElementById('symbol-restart-button').style.display = 'none';
    document.getElementById('symbol-return-menu-button').style.display = 'none';
    startNewRound();
});

// Function to show leaderboard
document.getElementById('view-leaderboard').addEventListener('click', function() {
    mainMenu.style.display = 'none'; // Hide the main menu
    document.getElementById('leaderboard-section').style.display = 'block'; // Show the leaderboard section
    fetchLeaderboard(); // Fetch and display leaderboard data
});

// Function to close leaderboard
document.getElementById('close-leaderboard-button').addEventListener('click', function() {
    document.getElementById('leaderboard-section').style.display = 'none'; // Hide leaderboard section
    mainMenu.style.display = 'flex'; // Show the main menu
});

// Function to add score to leaderboard
/* async function addScoreToLeaderboard(name, score) {
    try {
        await addDoc(collection(db, 'leaderboard', 'reactionTime', 'scores'), {
            name: name,
            score: score
        });
        console.log('Score added to leaderboard');
    } catch (error) {
        console.error('Error adding score to leaderboard: ', error);
    }
} */

async function addScoreToLeaderboard(name, score) {
    try {
        const response = await fetch('http://localhost:3000/saveScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, score })
        });

        if (response.ok) {
            console.log('Score added to leaderboard');
        } else {
            console.error('Error adding score to leaderboard');
        }
    } catch (error) {
        console.error('Error adding score to leaderboard: ', error);
    }
}

// Function to fetch leaderboard data
/* async function fetchLeaderboard() {
    try {
        const q = query(collection(db, 'leaderboard', 'reactionTime', 'scores'), orderBy('score', 'asc'), limit(10));
        const querySnapshot = await getDocs(q);
        const leaderboard = [];

        querySnapshot.forEach((doc) => {
            leaderboard.push(doc.data());
        });

        const leaderboardData = document.getElementById('leaderboard-data');
        leaderboardData.innerHTML = '';

        leaderboard.forEach(entry => {
            const div = document.createElement('div');
            div.textContent = `${entry.name}: ${entry.score} ms`;
            leaderboardData.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching leaderboard data: ', error);
    }
} */

async function fetchLeaderboard() {
    try {
        const response = await fetch('http://localhost:3000/leaderboard');
        const leaderboard = await response.json();

        const leaderboardData = document.getElementById('leaderboard-data');
        leaderboardData.innerHTML = '';

        leaderboard.forEach(entry => {
            const div = document.createElement('div');
            div.textContent = `${entry.name}: ${entry.score} ms`;
            leaderboardData.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching leaderboard data: ', error);
    }
}
