import {
    PLAYFIELD_COLUMNS,
    PLAYFIELD_ROWS,
    TETROMINOES,
    TETROMINO_NAMES,
    getRandomElement,
    rotateMatrix
} from "./utilities.js";

export class Tetris {
    constructor() {
        this.playField;
        this.init();
        this.tetromino;
    }

    init() {
        this.generatePlayField();
        this.generateTetromino();
    }

    generatePlayField() {
        this.playField = new Array(PLAYFIELD_ROWS).fill()
            .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
    }

    generateTetromino() {
        const name = getRandomElement(TETROMINO_NAMES);
        const matrix = TETROMINOES[name];

        const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
        // const row = -2;
        const row = 3;

        this.tetromino = {
            name,
            matrix,
            row,
            column
        }
    }

    moveTetrominoDown() {
        this.tetromino.row += 1;
        if (!this.isValid()) {
            this.tetromino.row -=1;
        }
    }

    moveTetrominoLeft() {
        this.tetromino.column -= 1;
        if (!this.isValid()) {
            this.tetromino.column +=1;
        }
    }

    moveTetrominoRight() {
        this.tetromino.column += 1;
        if (!this.isValid()) {
            this.tetromino.column -=1;
        }
    }

    rotateTetromino() {
        const oldMatrix = this.tetromino.matrix;
        const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
        this.tetromino.matrix = rotatedMatrix;

        if (!this.isValid()) {
            this.tetromino.row = oldMatrix;
        }
    }

    isValid() {
        const matrixSize = this.tetromino.matrix.length;

        for (let row = 0; row < matrixSize; row++) {
            for(let column = 0; column < matrixSize; column++) {
                if (!this.tetromino.matrix[row][column]) continue;
                if (this.isOutsideOfGameBoard(row, column)) return false;
            }
        }

        return true;
    }

    isOutsideOfGameBoard(row, column) {
        return this.tetromino.column + column < 0 ||
            this.tetromino.column + column >= PLAYFIELD_COLUMNS ||
            this.tetromino.row + row >= this.playField.length;
    }
}