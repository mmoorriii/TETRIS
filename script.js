import { Tetris } from "./src/tetris.js";
import {convertPositionToIndex, PLAYFIELD_COLUMNS, PLAYFIELD_ROWS} from "./src/utilities.js";

let requestId;
let timeoutId;
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');

initKeydown();

moveDown();

//--управление------------------------------------------------------------------------------------
function initKeydown() {
    document.addEventListener('keydown', onKeydown);
}

function onKeydown(event) {
    switch (event.key.toLowerCase()) {
        case 'w':
        case 'ц':
        case 'ArrowUp':
            rotate();
            break;
        case 's':
        case 'ы':
        case 'ArrowDown':
            moveDown();
            break;
        case 'a':
        case 'ф':
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'd':
        case 'в':
        case 'ArrowRight':
            moveRight();
            break;
    }
}

function moveDown() {
    tetris.moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if (tetris.isGameOver) {
        gameOver();
    }
}

function moveLeft() {
    tetris.moveTetrominoLeft();
    draw();
}

function moveRight() {
    tetris.moveTetrominoRight();
    draw();
}

function rotate() {
    tetris.rotateTetromino();
    draw();
}

function startLoop() { //---------------------падение фигур с задержкой 0,7с
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700);
}

function stopLoop() { //----------------------остановка цикла падения фигур
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
}

//--прорисовка фигур-------------------------------------------------------------------------------
function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
    drawGhostTetromino();
}

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (!tetris.playField[row][column]) continue;

            const name = tetris.playField[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    const name = tetris.tetromino.name;
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {

            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.row + row < 0) continue;

            const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawGhostTetromino() { //----------------------------тень
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for ( let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.ghostRow + row < 0) continue;

            const cellIndex = convertPositionToIndex(tetris.tetromino.ghostRow + row, tetris.tetromino.ghostColumn + column);
            cells[cellIndex].classList.add('ghost');
        }
    }
}

//-----------------------------------------------------------------------------------
function gameOver () {
    stopLoop();
    document.removeEventListener('keydown', onKeydown);
    document.querySelector('.grid').classList.add('game-over');
}

