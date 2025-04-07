import { CrossDirection, EMPTY, Mark, Tile } from "../context";

export function validMove(
  x: number,
  y: number,
  mark: Mark,
  turn: Mark | null,
  board: Tile[][]
) {
  // player can only make move with own mark
  if (mark !== turn) return false;

  if (board[x][y].mark === EMPTY) return true;
  return false;
}

type CIGSEReturnType = {
  shouldEnd: boolean;
  winningMark: Mark;
  crossDir: CrossDirection;
  pos?: { x?: number; y?: number };
};
export function checkIfGameShouldEnd(
  board: Tile[][]
): CIGSEReturnType | boolean {
  const rows = board;
  const cols = getCols(board);
  const crossDown = getCrossDown(board);
  const crossUp = getCrossUp(board);

  // checking if there is a line in row and column
  const arrLength = rows.length;
  for (let i = 0; i < arrLength; i++) {
    const row = rows[i];
    const col = cols[i];
    const rowResult = areAllTilesHaveSameMark(row);
    const colResult = areAllTilesHaveSameMark(col);

    if (rowResult.areSame) {
      return {
        shouldEnd: true,
        crossDir: "horizontal",
        winningMark: rowResult.mark!,
        pos: { x: i },
      };
    }

    if (colResult.areSame) {
      return {
        shouldEnd: true,
        crossDir: "vertical",
        winningMark: colResult.mark!,
        pos: { y: i },
      };
    }
  }

  // checking a line in both crosses
  const crossDownResult = areAllTilesHaveSameMark(crossDown);
  const crossUpResult = areAllTilesHaveSameMark(crossUp);

  if (crossDownResult.areSame) {
    return {
      shouldEnd: true,
      crossDir: "cross-down",
      winningMark: crossDownResult.mark!,
    };
  }

  if (crossUpResult.areSame) {
    return {
      shouldEnd: true,
      crossDir: "cross-up",
      winningMark: crossUpResult.mark!,
    };
  }

  return false;
}

export function checkIfThereIsDraw(board: Tile[][]) {
  for (const row of board) {
    const containEmptyMark = row.some((tile) => tile.mark === EMPTY);
    if (containEmptyMark) return false;
  }

  return true;
}

export function createInitialBoard(size: number): Tile[][] {
  const initialTile: Tile = {
    crossDirection: undefined,
    isCrossed: false,
    mark: EMPTY,
    pos: { x: -1, y: -1 },
  };

  const initialBoard: Tile[][] = [];
  for (let i = 0; i < size; i++) {
    const row: Tile[] = [];
    for (let j = 0; j < size; j++) {
      row.push({ ...initialTile, pos: { x: i, y: j } });
    }
    initialBoard.push(row);
  }

  return initialBoard;
}

export function getRandomEmptyTile(board: Tile[][]) {
  const emptyTiles = getEmptyTiles(board);
  if (emptyTiles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * emptyTiles.length);

  return emptyTiles[randomIndex];
}

// helpers
export function getCols(board: Tile[][]) {
  const columns: Tile[][] = [];
  for (let i = 0; i < board.length; i++) {
    const currentColumn: Tile[] = [];
    for (let j = 0; j < board[i].length; j++) {
      currentColumn.push(board[j][i]);
    }
    columns.push(currentColumn);
  }

  return columns;
}

export function getCrossDown(board: Tile[][]) {
  const cross: Tile[] = [];

  const limit = board.length;
  let i = 0;

  while (i < limit) {
    cross.push(board[i][i]);
    i += 1;
  }

  return cross;
}

export function getCrossUp(board: Tile[][]) {
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

export function areAllTilesHaveSameMark(tileArr: Tile[]) {
  if (tileArr.length === 0 || tileArr[0].mark === EMPTY)
    return { areSame: false, mark: null };
  for (let i = 1; i < tileArr.length; i++) {
    if (tileArr[i - 1].mark !== tileArr[i].mark)
      return { areSame: false, mark: null };
  }

  return { areSame: true, mark: tileArr[0].mark };
}

export function getEmptyTiles(board: Tile[][]) {
  const emptyTiles: { x: number; y: number }[] = [];
  const boardLength = board.length;
  for (let i = 0; i < boardLength; i++) {
    for (let j = 0; j < boardLength; j++) {
      if (board[i][j].mark === EMPTY) emptyTiles.push({ x: i, y: j });
    }
  }

  return emptyTiles;
}
