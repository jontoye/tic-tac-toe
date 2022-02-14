/*****************************************************
 * MODEL
 ****************************************************/
const game = {

    // Each square is represented by its html id and contains the 
    // player number who currently occupies it
    board: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
    },

    winLocations: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],

    players: {
        1: {name: 'Player 1', img: "img/X/X5.png", squares: [], wins: 0},
        2: {name: 'Player 2', img: "img/O/O5.png", squares: [], wins: 0}
    },

    whosTurn: null,
    winner: null,
    playing: false,

    // Reset data for next round (saves # of wins)
    reset: function() {
        this.clearBoard();
        this.clearPlayerSquares();
        this.playing = true;
        this.whosTurn = 1;
        this.winner = null;
    },

    clearBoard: function() {
        for (let id in this.board) {
            this.board[id] = null;
        }
    },

    clearPlayerSquares: function() {
        for (let id in this.players) {
            this.players[id].squares = [];
        }
    },

    clearWins: function() {
        for (let id in this.players) {
            this.players[id].wins = 0;
        }
    }
}

/*****************************************************
 * VIEW
 ****************************************************/
// DOM Elements
const boardElement = document.querySelector('.board');
const squareElements = document.querySelectorAll('.square');
const currentPlayerElement = document.querySelector('#current-player');
const currentImgElement = document.querySelector('#current-img');
const msgBoxElement = document.querySelector('.msg-box');
const scorePlayerOneElement = document.querySelector('#score-p1');
const scorePlayerTwoElement = document.querySelector('#score-p2');
const p1NameInput = document.querySelector('#p1-name');
const p2NameInput = document.querySelector('#p2-name');
const playerImgOptions = document.querySelectorAll('.player-imgs');
const startBtnElement = document.querySelector('#startBtn');

// Event Listeners
boardElement.addEventListener('click', onBoardClick);
document.querySelectorAll('button').forEach(btn => btn.addEventListener('click', onBtnClick));
playerImgOptions.forEach(player => player.addEventListener('click', onImgClick));

// Add OR remove the current players marker to the square with specified id
function renderBoard(id) {
    let squareElement = document.getElementById(id);

    // Removes a marker
    if (squareElement.hasChildNodes()) {
        squareElement.removeChild(squareElement.firstChild);

    // Adds a marker
    } else {
        let markerElement = document.createElement('img');
        markerElement.classList.add('marker');
        markerElement.src = game.players[game.board[id]].img;
        squareElement.append(markerElement);
    }

}

// Update the game-stats box
function renderGameInfo() {
    let currentPlayerName = getCurrentPlayer().name;
    let currentPlayerImg = getCurrentPlayer().img;
    currentPlayerElement.innerText = currentPlayerName;
    currentImgElement.setAttribute('src', currentPlayerImg);
}

// Display end game message and update stats
function renderWinner() {
    if (game.winner === 'TIE') {
        console.log('TIE GAME')
        msgBoxElement.innerText = 'TIE GAME';
    } else {
        console.log(`${game.winner} wins!`);
        msgBoxElement.innerText = `GAME OVER 
            ${game.winner.toUpperCase()} WINS!`;
    }
    scorePlayerOneElement.innerText = `${game.players[1].name}: ${game.players[1].wins}`
    scorePlayerTwoElement.innerText = `${game.players[2].name}: ${game.players[2].wins}`
}

function renderSwitchPages() {
    document.querySelector('.game-page').classList.toggle('hidden');
    document.querySelector('.welcome-page').classList.toggle('hidden');
}

function renderImgFocus(imgElement, parentElement) {
    Array.from(parentElement.children).forEach(img => img.classList.remove('active'));
    imgElement.classList.add('active');
}

function renderClearBoard() {
    squareElements.forEach(square => {
        if (square.hasChildNodes()) {
            square.removeChild(square.firstChild);
        }
    })
}

function renderClearMessage() {
    msgBoxElement.innerText = '';
}


function renderClearStats() {
    scorePlayerOneElement.innerText = '';
    scorePlayerTwoElement.innerText = '';

}

/*****************************************************
 * CONTROLLER
 ****************************************************/
function init() {
    // Initialize player names
    game.players[1].name = p1NameInput.value === '' ? 'Player 1' : p1NameInput.value;
    game.players[2].name = p2NameInput.value === '' ? 'Player 2' : p2NameInput.value;
    startGame();
}

function onBoardClick(event) {

    if (game.playing) {
        let elementClicked = event.target;

        // If the space clicked is already occupied or is not a square element, exit handler
        if (elementClicked.hasChildNodes() || 
            elementClicked.className !== 'square') 
            return;
    
        // Update the game object data
        game.board[elementClicked.id] = game.whosTurn;
        getCurrentPlayer().squares.push(Number(elementClicked.id));

        renderBoard(elementClicked.id);
        checkForWinner();

        // Check if game continues
        if (game.winner) {
            renderWinner();
            return;
        } else {
            switchPlayer();
        }
        renderGameInfo();
    }
}

function onBtnClick(event) {
        let elementClicked = event.target;
        if (elementClicked.id === 'restartBtn') {
            stopGame();
            startGame();
        } else if (elementClicked.id === 'undoBtn' && game.playing) {
            undoLastMove();
        } else if (elementClicked.id === 'startBtn') {
            init();
            renderSwitchPages();
        } else if (elementClicked.id === 'quitToMenuBtn') {{
            renderSwitchPages();
            renderClearStats();
            game.reset();
            game.clearWins();
            stopGame();
        }}
}

function onImgClick(event) {
    let elementClicked = event.target;
    if (elementClicked.nodeName === 'IMG') {
        renderImgFocus(elementClicked, event.currentTarget);
        let playerID = event.currentTarget.id[1]
        let imgSrc = elementClicked.getAttribute('src');
        setPlayerImg(playerID, imgSrc);
    }
}

function undoLastMove() {
    if (game.players[1].squares.length + game.players[2].squares.length > 0) {
        switchPlayer();
        let lastPlayedSquare = getCurrentPlayer().squares.pop();
        renderBoard(lastPlayedSquare);
        renderGameInfo();
    }
}

function checkForWinner() {
    let currentPlayerPositions = getCurrentPlayer().squares

    // Only checks for winner if current player occupies at least 3 squares
    if (currentPlayerPositions.length > 2) {
        game.winLocations.forEach(winningLine => {
            if (currentPlayerPositions.includes(winningLine[0]) &&
                currentPlayerPositions.includes(winningLine[1]) &&
                currentPlayerPositions.includes(winningLine[2])) {
                    game.winner = getCurrentPlayer().name;
                    getCurrentPlayer().wins++;
                    game.playing = false;
                    return;
                }
        });
    }

    // If all squares are occupied and no winner has been found, game ends in a tie
    if (game.players[1].squares.length + game.players[2].squares.length === 9 &&
        !game.winner) {
        game.winner = 'TIE';
        game.playing = false;
    }
}

function switchPlayer() {
    game.whosTurn = game.whosTurn === 1 ? 2 : 1;
}

function getCurrentPlayer() {
    return game.players[game.whosTurn];
}

function setPlayerImg(id, img) {
    game.players[id].img = img;
}

function stopGame() {
    renderClearBoard();
    renderClearMessage();
    game.whosTurn = null;
    game.playing = false;
}

function startGame() {
    game.whosTurn = 1;
    game.reset();
    renderGameInfo();
}

window.game = game;



