import {
    PLAYFIELD_COLUMNS,
    PLAYFIELD_ROWS,
    TETROMINOES,
    TETROMINO_NAMES,
    getRandomElement
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
}