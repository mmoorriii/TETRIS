export const PLAYFIELD_COLUMNS = 10;
export const PLAYFIELD_ROWS = 20;
export const TETROMINO_NAMES = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'];
export const TETROMINOES = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'O': [
        [1, 1],
        [1, 1]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ]
};


let previousElement = null;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function getRandomElement(array) {
    if (previousElement !== null) {
        array = array.filter(element => element !== previousElement);
    }

    shuffleArray(array);

    const element = array[0];
    previousElement = element;

    return element;
}


// let previousElement = null;
//
// export function getRandomElement(array) {
//     let randomIndex = Math.floor(Math.random() * array.length);
//     let element = array[randomIndex];
//
//     //--повторная генерация фигуры пока предыдущая фигура совпадает с текущей
//     while (element === previousElement) {
//         randomIndex = Math.floor(Math.random() * array.length);
//         element = array[randomIndex];
//     }
//
//     previousElement = element;
//
//     return element;
// }


export function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}


export function rotateMatrix(matrix) {
    const L = matrix.length;
    const rotatedMatrix = [];

    for (let i = 0; i < L; i++) {
        rotatedMatrix[i] = [];
        for (let j = 0; j < L; j++) {
            rotatedMatrix[i][j] = matrix[L - j - 1][i]
        }
    }

    return rotatedMatrix;
}