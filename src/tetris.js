import {
    PLAYFIELD_COLUMNS,
    PLAYFIELD_ROWS,
    TETROMINOES,
    TETROMINO_NAMES,
    getRandomElement,
    rotateMatrix
} from "./utilities.js";

import {
    updateScore,
    updateLevel
} from "../script.js";


export let playField;
export let tetromino;
export let isGameOver = false;

function init() {
    generatePlayField();
    generateTetromino();
}

function generatePlayField() {
    playField = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTetromino() {
    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];

    const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
    const row = -2;

    tetromino = {
        name,
        matrix,
        row,
        column,
        ghostColumn: column,
        ghostRow: row
    }

    calculateGhostPosition();
}

init();

//------передвижение фигурок------------------------------------------------------------------------------------
export function moveTetrominoDown() {
    tetromino.row += 1;

    if (!isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }
}

export function moveTetrominoLeft() {
    tetromino.column -= 1;

    if (!isValid()) {
        tetromino.column += 1;
    } else {
        calculateGhostPosition();
    }
}

export function moveTetrominoRight() {
    tetromino.column += 1;

    if (!isValid()) {
        tetromino.column -= 1;
    } else {
        calculateGhostPosition();
    }
}

export function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;

    if (!isValid()) {
        tetromino.matrix = oldMatrix;
    } else {
        calculateGhostPosition();
    }
}

//--------------------------------------------------------------------------------------------------------
function isValid() {
    const matrixSize = tetromino.matrix.length;

    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            if (isOutsideOfGameBoard(row, column)) return false;
            if (isCollides(row, column)) return false;
        }
    }

    return true;
}

function isOutsideOfGameBoard(row, column) {
    return tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= playField.length;
}

function isCollides(row, column) {
    return playField[tetromino.row + row]?.[tetromino.column + column];
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;

    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            if (isOutsideOfTopBoard(row)) {
                isGameOver = true;
                return;
            }

            playField[tetromino.row + row][tetromino.column + column] = tetromino.name;
        }
    }

    processFilledRows();
    generateTetromino();
}

function isOutsideOfTopBoard (row) {
    return tetromino.row + row < 0;
}

function processFilledRows() {
    const filledLines = findFilledRows();
    removeFilledRows(filledLines);
}

function findFilledRows() {
    const filledRows = [];

    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        if (playField[row].every(cell => Boolean(cell))) {
            filledRows.push(row);
        }
    }

    return filledRows;
}

function removeFilledRows(filledRows) {
    filledRows.forEach(row => {
        dropRowsAbove(row);
    })
    updateScore(filledRows.length);
}

function dropRowsAbove(rowToDelete) {
    for (let row = rowToDelete; row > 0; row--) {
        playField[row] = playField[row - 1];
    }
    playField[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
    updateLevel();
}

//------тень-------------------------------------------------------------
function calculateGhostPosition() {
    const tetrominoRow = tetromino.row;
    tetromino.row++;

    while (isValid()) {
        tetromino.row++;
    }

    tetromino.ghostRow = tetromino.row - 1;
    tetromino.ghostColumn = tetromino.column;
    tetromino.row = tetrominoRow;
}