import { Cords, Board, Difficulty, Field } from "./types";
import { v4 as uuid } from "uuid";

const surroundingValues = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

function isValueCorner(cords: Cords) {
  const [x, y] = cords;
  return Math.abs(x) === 1 && Math.abs(y) === 1;
}

function isValueInBoard(boardSize: number, cords: Cords) {
  const [x, y] = cords;
  return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
}

export const mappedBoardInfo = new Map<
  Difficulty,
  { size: number; minesCount: number }
>([
  ["easy", { size: 10, minesCount: 10 }],
  ["medium", { size: 15, minesCount: 40 }],
  ["hard", { size: 25, minesCount: 99 }],
]);

export function createBoardWithMines(
  size: number,
  minesCount: number,
  cords: Cords,
): Board {
  const board: Board = [];
  for (let i = 0; i < size; i++) {
    board.push([]);
    for (let j = 0; j < size; j++) {
      board[i].push({
        id: uuid(),
        cords: [i, j],
        isMine: false,
        value: 0,
        isReveled: false,
        isFlagged: false,
      });
    }
  }

  let minesPlaced = 0;

  const omittedCords: Cords[] = [];
  for (const [dx, dy] of [...surroundingValues, [0, 0]]) {
    const [cx, cy] = cords;
    omittedCords.push([cx + dx, cy + dy]);
  }

  while (minesPlaced < minesCount) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (omittedCords.some(([ox, oy]) => ox === x && oy === y)) continue;

    if (!board[x][y].isMine) {
      // Ensure the random position is not already a mine
      board[x][y].isMine = true;
      minesPlaced++;
    }
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j].isMine) continue; // Skip if the cell is a mine
      const surroundingCords = getSurroundingCords([i, j], size);
      for (const cords of surroundingCords) {
        const [x, y] = cords;
        if (board[x][y].isMine) board[i][j].value++;
      }
    }
  }

  return board;
}

export function getSurroundingCords(
  cords: Cords,
  boardSize: number,
  variant?: "omit-edges",
): Cords[] {
  const [x, y] = cords;
  const surroundingCords: Cords[] = [];

  for (const [dx, dy] of surroundingValues) {
    const [newX, newY] = [x + dx, y + dy];
    if (!isValueInBoard(boardSize, [newX, newY])) continue;
    if (variant === "omit-edges" && isValueCorner([dx, dy])) continue;
    surroundingCords.push([newX, newY]);
  }

  return surroundingCords;
}

export function revealBoardRecursively(
  board: Board,
  cords: Cords,
  depth: number,
): Board {
  const [x, y] = cords;
  const currentField = board[x][y];

  // Check if the field is already revealed or flagged
  if (currentField.isReveled || currentField.isFlagged || currentField.isMine)
    return board;

  board[x][y].isReveled = true;
  board[x][y].revealDaley = depth;

  const surroundingMinesCount = getSurroundingCords(cords, board.length).filter(
    ([bx, by]) => board[bx][by].isMine,
  ).length;

  // Calculate the value of the field based on the surrounding mines and mark the surrounding fields as revealed if they are not mines and have no adjacent mines
  const surroundingCords = getSurroundingCords(
    [x, y],
    board.length,
    // "omit-edges",
  );

  if (surroundingCords.length > 0 && surroundingMinesCount === 0) {
    for (const sCords of surroundingCords) {
      revealBoardRecursively(board, sCords, depth + 1);
    }
  }

  return board;
}

export function getLostFlags(board: Board) {
  return board.flat().filter((field) => field.isFlagged && field.isReveled)
    .length;
}

export function revealMinesWithDelay(board: Board) {
  let delay = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].isMine && board[i][j].isReveled === false) {
        board[i][j].revealDaley = delay;
        board[i][j].isReveled = true;
        delay += 1;
      }
    }
  }

  return board;
}

export function isThereWin(board: Board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j].isMine && !board[i][j].isReveled) return false;
    }
  }
  return true;
}
