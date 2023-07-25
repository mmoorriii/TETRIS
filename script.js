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

//-------уровень--------------------------------------------------------------------------------
let levelElement = document.getElementById('level');
let count = 0;
let level = 1;
let baseDelay = 700;

export function updateLevel () {
    count++;

    if (count === 10) {
        level++;
        count = 0;
        if (baseDelay > 300) baseDelay -= 50;
    }

    levelElement.innerHTML = level;
}

//-------счет--------------------------------------------------------------------------------
let scoreElement = document.getElementById('score');
let score = 0;

export function updateScore(completedRows) {
    switch (completedRows) {
        case 1:
            score += 100;
            break;
        case 2:
            score += 300;
            break;
        case 3:
            score += 700;
            break;
        case 4:
            score += 1500;
            break;
    }
    scoreElement.innerHTML = score;
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
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), baseDelay);
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

//-------------------------------------------------------------------------
const restart = document.getElementById('restart');

restart.onclick = () => {
    window.location.reload();
}

