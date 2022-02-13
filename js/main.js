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
        1: {name: 'Player 1', img: "img/x-img.png", squares: [], wins: 0},
        2: {name: 'Player 2', img: "img/o-img.png", squares: [], wins: 0}
    },

    whosTurn: null,
    winner: null,
    playing: false,

    // Rest data for next round
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
    }
}

/*****************************************************
 * VIEW
 ****************************************************/
// DOM Elements
const boardElement = document.querySelector('.board');
const squareElements = document.querySelectorAll('.square');
const controlBtnsElement = document.querySelector('.control-buttons');
const playerNameElement = document.querySelector('#player-name');
const playerImgElement = document.querySelector('#player-img');
const msgBoxElement = document.querySelector('.msg-box');
const winsPlayerOneElement = document.querySelector('#wins-p1');
const winsPlayerTwoElement = document.querySelector('#wins-p2');

// Event Listeners
boardElement.addEventListener('click', onBoardClick);
controlBtnsElement.addEventListener('click', onBtnClick);


// Add the current players marker to the square with specified id
function renderBoard(id) {
    let squareElement = document.getElementById(id);
    let markerElement = document.createElement('img');
    markerElement.classList.add('marker');
    markerElement.src = game.players[game.board[id]].img;
    squareElement.append(markerElement);
}

// Update the game-stats box
function renderGameInfo() {
    let currentPlayerName = game.players[game.whosTurn].name;
    let currentPlayerImg = game.players[game.whosTurn].img;
    playerNameElement.innerText = currentPlayerName;
    playerImgElement.setAttribute('src', currentPlayerImg);
}

// Display end game message and update stats
function renderEndGame() {
    if (game.winner === 'TIE') {
        console.log('TIE GAME')
        msgBoxElement.innerText = 'TIE GAME';
    } else {
        console.log(`${game.winner} wins!`);
        msgBoxElement.innerText = `GAME OVER: ${game.winner.toUpperCase()} WINS!`;
    }
    winsPlayerOneElement.innerText = `${game.players[1].name}: ${game.players[1].wins}`
    winsPlayerTwoElement.innerText = `${game.players[2].name}: ${game.players[2].wins}`
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

/*****************************************************
 * CONTROLLER
 ****************************************************/
function init() {
    game.reset();
    renderGameInfo();
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
        game.players[game.whosTurn].squares.push(Number(elementClicked.id));

        renderBoard(elementClicked.id);
        checkForWinner();

        // Check if game continues
        if (game.winner) {
            renderEndGame();
            return;
        } else {
            game.whosTurn = game.whosTurn === 1 ? 2 : 1;
        }
        renderGameInfo();
    }
}

function onBtnClick(event) {
        let elementClicked = event.target;
        if (elementClicked.id === 'restartBtn') {
            restartGame();
        } else if (elementClicked.id === 'undoBtn' && game.playing) {
            undoLastMove();
        }
}

function undoLastMove() {
    console.log('undo last move');
}

function checkForWinner() {
    let currentPlayerPositions = game.players[game.whosTurn].squares

    // Only checks for winner if current player occupies at least 3 squares
    if (currentPlayerPositions.length > 2) {
        game.winLocations.forEach(winningLine => {
            if (currentPlayerPositions.includes(winningLine[0]) &&
                currentPlayerPositions.includes(winningLine[1]) &&
                currentPlayerPositions.includes(winningLine[2])) {
                    game.winner = game.players[game.whosTurn].name;
                    game.players[game.whosTurn].wins++;
                    game.playing = false;
                    return;
                }
        });
    }

    // If all squares are occupied and no winner has been found, game ends in a tie
    if (game.players[1].squares.length + game.players[2].squares.length === 9) {
        game.winner = 'TIE';
        game.playing = false;
    }
}

function restartGame() {
    renderClearBoard();
    renderClearMessage();
    init();
}

init();
window.game = game;