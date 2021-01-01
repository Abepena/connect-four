/** Connect Four - AbE
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let gameOver = false;
let gameState = document.querySelector("#game-state");

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = [...Array(HEIGHT)].map((_) => Array(WIDTH).fill(null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  updateGameState(`Player ${currPlayer}'s turn`);
  const htmlBoard = document.querySelector("#board");
  // Create top row for the board
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Insert cells in table with ids for each column (zero indexed)
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create rows of with qty (WIDTH) cells and append to htmlTable
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const td = document.createElement("td");
      const cell = document.createElement("div");

      td.setAttribute("id", `${y}-${x}`);
      cell.className = "cell";
      td.append(cell);
      row.append(td);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add("piece", `player${currPlayer}`);

  const tableLocation = document.getElementById(`${y}-${x}`);
  tableLocation.append(piece);
}

function updateGameState(msg) {
  gameState.innerText = msg;
}

/** endGame: announce game end */

function endGame(msg) {
  //Change Game state
  updateGameState(msg);

  //add a reset button to DOM
  if (!gameOver) {
    const resetBtn = document.createElement("div");
    resetBtn.setAttribute("id", "reset-btn");
    resetBtn.innerText = "Reset";
    resetBtn.addEventListener("click", handleReset);
    gameState.parentElement.append(resetBtn);
  }

  gameOver = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gameOver) {
    return endGame("Game over! Click reset 👇");
  }

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  console.log(y);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame(`Its a tie!`);
  }
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  updateGameState(`Player ${currPlayer === 1 ? "one" : "two"}'s turn`);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //For every row in the board
  for (let y = 0; y < HEIGHT; y++) {
    //For every cell in the current row
    for (let x = 0; x < WIDTH; x++) {
      //horizontal, vertical, diagonal left, diagonal right win conditions
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      //return true if any of the win conditions are met for current player
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function handleReset(e) {
  const htmlBoard = document.querySelector("#board");
  while (htmlBoard.firstChild) {
    htmlBoard.removeChild(htmlBoard.firstChild);
  }
  makeBoard();
  makeHtmlBoard();
  currPlayer = 1;
  gameOver = false;
  updateGameState(`Player ${currPlayer}'s turn`);
  e.target.remove();
}

makeBoard();
makeHtmlBoard();
