import { SIZE, Tile, Board, Side } from "../types";

export function createInitialBoard() {
  const board: Board = [];
  for (let i = 0; i < SIZE; i++) {
    const row: Tile[] = [];
    for (let j = 0; j < SIZE; j++) {
      row.push({ cords: [i, j], side: null, isWinningTile: false });
    }
    board.push(row);
  }
  return board;
}

export function getOppositeSide(side: Side) {
  return side === "x" ? "o" : "x";
}

export function getRandomEmptyTile(board: Board) {
  const emptyTiles = getEmptyTiles(board);
  if (emptyTiles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * emptyTiles.length);

  return emptyTiles[randomIndex];
}

export function getCols(board: Board) {
  const columns: Board = [];

  for (let i = 0; i < board.length; i++) {
    const currentColumn: Tile[] = [];
    for (let j = 0; j < board[i].length; j++) {
      currentColumn.push(board[j][i]);
    }
    columns.push(currentColumn);
  }

  return columns;
}

export function getCrossDown(board: Board) {
  const cross: Tile[] = [];

  const limit = board.length;
  let i = 0;

  while (i < limit) {
    cross.push(board[i][i]);
    i += 1;
  }

  return cross;
}

export function getCrossUp(board: Board) {
  const cross: Tile[] = [];

  const limit = board.length;
  let i = limit - 1;
  let j = 0;

  while (i >= 0 && j < limit) {
    cross.push(board[i][j]);
    i -= 1;
    j += 1;
  }

  return cross;
}

export function areAllTilesHaveSameSide(tilesArray: Tile[]) {
  if (tilesArray.length === 0 || tilesArray[0].side === null) return false;

  for (let i = 1; i < tilesArray.length; i++) {
    if (tilesArray[i - 1].side !== tilesArray[i].side) return false;
  }

  return true;
}

export function getEmptyTiles(board: Board) {
  const emptyTiles: Tile["cords"][] = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j].side === null) emptyTiles.push([i, j]);
    }
  }

  return emptyTiles;
}

export function getWinningTiles(board: Board): Tile[] | null {
  const rows = board;
  const columns = getCols(board);
  const crossDown = getCrossDown(board);
  const crossUp = getCrossUp(board);

  const allLines = [...rows, ...columns, crossDown, crossUp];

  for (const line of allLines) {
    const sidesInLine = new Set(line.map((tile) => tile.side));
    if (sidesInLine.size !== 1 || sidesInLine.has(null)) continue;

    return line;
  }

  return null;
}

export function checkIfThereIsDraw(board: Board) {
  for (const row of board) {
    const containEmptyMark = row.some((tile) => tile.side === null);
    if (containEmptyMark) return false;
  }

  return true;
}
