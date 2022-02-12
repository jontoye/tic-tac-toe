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
        1: {name: 'Jon', img: "img/x-img.png", squares: []},
        2: {name: 'Cheryl', img: "img/o-img.png", squares: []}
    },

    whosTurn: null,
    winner: null,
    playing: false,

    init: function() {
        this.playing = true;
        this.whosTurn = 1;
    },
}

/*****************************************************
 * VIEW
 ****************************************************/
const boardElement = document.querySelector('.board');
boardElement.addEventListener('click', onBoardClick);

// Add the current players marker to the square with specified id
function renderBoard(id) {
    let squareElement = document.getElementById(id);
    let markerElement = document.createElement('img');
    markerElement.classList.add('marker');
    markerElement.src = game.players[game.board[id]].img;
    squareElement.append(markerElement);
}

// Display end game message
function renderEndGame() {
    if (game.winner === 'TIE') {
        console.log('TIE GAME')
    } else {
        console.log(`${game.winner} wins!`);
    }
}

function clearBoard() {

}

/*****************************************************
 * CONTROLLER
 ****************************************************/
function onBoardClick(event) {
    let elementClicked = event.target;

    if (game.playing) {

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
        } else {
            game.whosTurn = game.whosTurn === 1 ? 2 : 1;
        }

    }

}

function undoLastMove() {

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

function restart() {

}

game.init();
window.game = game;