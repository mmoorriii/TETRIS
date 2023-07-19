import {
    moveTetrominoDown,
    moveTetrominoRight,
    moveTetrominoLeft,
    rotateTetromino,
    isGameOver,
    playField,
    tetromino
} from "./src/tetris.js";

import { convertPositionToIndex, PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from "./src/utilities.js";


let requestId;
let timeoutId;
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
let stateGame = false;

function startGame () {
    start.addEventListener('click', () => {
        if (!stateGame) {
            allowMoveDown = true;
            moveDown();
            stateGame = true;
            start.innerHTML = 'STOP';
            allowMoveLeft = true;
            allowMoveRight = true;
            allowMoveRotate = true;
        } else {
            allowMoveDown = false;
            stopLoop();
            stateGame = false;
            start.innerHTML = 'START';
            allowMoveLeft = false;
            allowMoveRight = false;
            allowMoveRotate = false;
        }
    })
}

//-------счет и уровень--------------------------------------------------------------------------------
let level = document.getElementById('level');



let score = document.getElementById('score');

score.innerHTML = parseInt(0);

export function updateScore (completedRows) {
    switch (completedRows) {
        case 1:
            score.innerHTML = parseInt(score.innerHTML) + 100;
            break;
        case 2:
            score.innerHTML = parseInt(score.innerHTML) + 300;
            break;
        case 3:
            score.innerHTML = parseInt(score.innerHTML) + 700;
            break;
        case 4:
            score.innerHTML = parseInt(score.innerHTML) + 1500;
            break;
    }
}

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
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if (isGameOver) gameOver();
}

function moveLeft() {
    if (!allowMoveLeft) return;
    moveTetrominoLeft();
    draw();
}

function moveRight() {
    if (!allowMoveRight) return;
    moveTetrominoRight();
    draw();
}

function rotate() {
    if (!allowMoveRotate) return;
    rotateTetromino();
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
            if (!playField[row][column]) continue;

            const name = playField[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {

            if (!tetromino.matrix[row][column]) continue;
            if (tetromino.row + row < 0) continue;

            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

//-----------тень---------------------------------------------------------------------------------------------------------
function drawGhostTetromino() { //----------------------------тень
    const tetrominoMatrixSize = tetromino.matrix.length;

    for ( let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            if (tetromino.ghostRow + row < 0) continue;

            const cellIndex = convertPositionToIndex(tetromino.ghostRow + row, tetromino.ghostColumn + column);

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
    stateGame = false;
    start.innerHTML = 'START';
    document.removeEventListener('keydown', onKeydown);
    document.querySelector('.grid').classList.add('game-over');
    start.classList.add('game-over');
}

