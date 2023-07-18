import { Tetris } from "./src/tetris.js";
import {convertPositionToIndex, PLAYFIELD_COLUMNS, PLAYFIELD_ROWS} from "./src/utilities.js";

let requestId;
let timeoutId;
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');
const start = document.querySelector('#start');
const ghost = document.querySelector('#ghost');
const grid = document.querySelector('.grid');

initKeydown();

startGame();

//--------------------------------------------------------------------------------
let allowMoveLeft = true;
let allowMoveRight = true;
let allowMoveRotate = true;
let allowMoveDown = true;

function startGame () {
    start.addEventListener('click', () => {
        if (!tetris.stateGame) {
            allowMoveDown = true;
            moveDown();
            tetris.stateGame = true;
            start.innerHTML = 'STOP';
            allowMoveLeft = true;
            allowMoveRight = true;
            allowMoveRotate = true;
        } else {
            allowMoveDown = false;
            stopLoop();
            tetris.stateGame = false;
            start.innerHTML = 'START';
            allowMoveLeft = false;
            allowMoveRight = false;
            allowMoveRotate = false;
        }
    })
}

//-------счет и уровень--------------------------------------------------------------------------------
let score = document.querySelector('.count>span');
let level = document.querySelector('.level>span');
score.innerHTML = tetris.score;


function updateLevel() {
    level.innerHTML = tetris.level;
}

updateLevel();

// let clearedRows = 0;
//
// function removeFilledRows() {
//     // Проверка и удаление заполненных рядов
//     for (let row = 0; row < PLAYFIELD_ROWS; row++) {
//         let isRowComplete = true;
//
//         for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
//             if (!tetris.playField[row][column]) {
//                 isRowComplete = false;
//                 break;
//             }
//         }
//
//         if (isRowComplete) {
//             completedRows++;
//             tetris.playField.splice(row, 1);
//             tetris.playField.unshift(new Array(PLAYFIELD_COLUMNS).fill(0));
//         }
//     }
//
//     // clearedRows++; // Увеличение счетчика убранных рядов
// }

// removeFilledRows();

// console.log("Количество убранных рядов: " + clearedRows);


let completedRows = 0;
function checkRows() {
    for (let row = PLAYFIELD_ROWS - 1; row >= 0; row--) {
        let isRowComplete = true;

        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (tetris.playField[row][column] === 0) {
                isRowComplete = false;
                break;
            }
        }

        if (isRowComplete) {
            completedRows++;
            tetris.playField.splice(row, 1);
            tetris.playField.unshift(new Array(PLAYFIELD_COLUMNS).fill(0));
        }
    }

    if (completedRows > 0) {
        updateScore(completedRows);
    }

    console.log('убрано рядов: ' + completedRows);
}
checkRows();

function updateScore(completedRows) {
    let scoreToAdd = 0;
    let mainScore = 0;

    switch (completedRows) {
        case 1:
            scoreToAdd = 100;
            break;
        case 2:
            scoreToAdd = 300;
            break;
        case 3:
            scoreToAdd = 700;
            break;
        case 4:
            scoreToAdd = 1500;
            break;
    }

    mainScore += scoreToAdd;
    console.log(mainScore);
}

updateScore();

//--управление------------------------------------------------------------------------------------
function initKeydown() {
    document.addEventListener('keydown', onKeydown);
}

function onKeydown(event) {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            rotate();
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveDown();
            break;
        case 'KeyA':
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveRight();
            break;
    }
}

function moveDown() {
    if (!allowMoveDown) return;
    tetris.moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if (tetris.isGameOver) gameOver();
}

function moveLeft() {
    if (!allowMoveLeft) return;
    tetris.moveTetrominoLeft();
    draw();
}

function moveRight() {
    if (!allowMoveRight) return;
    tetris.moveTetrominoRight();
    draw();
}

function rotate() {
    if (!allowMoveRotate) return;
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

//-----------тень---------------------------------------------------------------------------------------------------------
function drawGhostTetromino() { //----------------------------тень
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;

    for ( let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.ghostRow + row < 0) continue;

            const cellIndex = convertPositionToIndex(tetris.tetromino.ghostRow + row, tetris.tetromino.ghostColumn + column);

            if (grid.classList.contains('shadow-on')) cells[cellIndex].classList.add('ghost');
        }
    }
}

ghost.addEventListener('click', () => {
    grid.classList.toggle('shadow-on');
    ghost.classList.toggle('shadow-on');
})

//-----------------------------------------------------------------------------------
function gameOver () {
    stopLoop();
    tetris.stateGame = false;
    start.innerHTML = 'START';
    document.removeEventListener('keydown', onKeydown);
    document.querySelector('.grid').classList.add('game-over');
    start.classList.add('game-over');
}
