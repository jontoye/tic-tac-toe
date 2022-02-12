/*****************************************************
 * MODEL
 ****************************************************/
const game = {
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

function renderBoard(id) {
    let square = document.getElementById(id);
    let img = document.createElement('img');
    img.src = game.players[game.board[id]].img;
    square.append(img);
}

function renderEndGame(player) {
    if (player === 'TIE') {
        console.log('Tie Game');
    } else {
        console.log(`${player} wins!`);
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
        if (elementClicked.hasChildNodes() || 
            elementClicked.className !== 'square') 
            return;
    
        game.board[elementClicked.id] = game.whosTurn;
        game.players[game.whosTurn].squares.push(Number(elementClicked.id));

        renderBoard(elementClicked.id);
        checkForWinner();

        if (game.winner) {
            renderEndGame(game.winner);
        } else {
            game.whosTurn = game.whosTurn === 1 ? 2 : 1;
        }

    }

}

function undo() {

}

function checkForWinner() {
    let squares = game.players[game.whosTurn].squares
    if (squares.length > 2) {
        game.winLocations.forEach(line => {
            if (squares.includes(line[0]) &&
                squares.includes(line[1]) &&
                squares.includes(line[2])) {
                    game.winner = game.players[game.whosTurn].name;
                    // console.log(game.players[game.whosTurn].name);
                    game.playing = false;
                    return;
                }
        });
    }
    if (game.players[1].squares.length + game.players[2].squares.length === 9) {
        game.winner = 'TIE';
        game.playing = false;
    }
}

function restart() {

}

game.init();
window.game = game;