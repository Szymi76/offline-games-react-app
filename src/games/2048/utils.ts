import {
  Board,
  Cords,
  GameMode,
  MoveDirection,
  RenderBoard,
  RenderTile,
  Tile,
  mappedRotations,
} from "./types";

import { v4 as uuid } from "uuid";

/**
 *
 * @param size rozmiar tablicy, np. 4x4
 * @param defaultValue wartość, która zostanie podana w każdym polu. Domyślnie `0`
 * @returns tablice 2d o podanym rozmiarze
 */
export function createInitialBoard(size: number, defaultValue?: number) {
  defaultValue = defaultValue ? defaultValue : 0;
  const board: Board = [];

  for (let i = 0; i < size; i++) {
    const row: Tile[] = [];
    for (let j = 0; j < size; j++) {
      row.push({ cords: { x: i, y: j }, value: defaultValue, id: uuid() });
    }
    board.push(row);
  }

  return board;
}

/**
 *
 * @param end koniec przedziału do którego ma zostać wygenerowana losowa liczba
 * @returns liczbę z przedziału <0, end)
 */
export function ranNum(end: number) {
  return Math.floor(Math.random() * end);
}

/**
 *
 * @param board plansza kafelków
 * @param tilesToFill ilość kafelków do wypełnienia (domyślnie `1`)
 * @returns plansze z wypełnionymi polami
 */
export function getRandomTiles(board: Board, tilesToFill?: number) {
  tilesToFill = tilesToFill ? tilesToFill : 1;
  const emptyTiles = board.flat().filter((tile) => tile.value === 0);
  const newTiles: Tile[] = [];

  while (tilesToFill > 0) {
    if (emptyTiles.length === 0) break;

    const index = ranNum(emptyTiles.length);
    const { cords } = emptyTiles[index];
    const value = Math.random() <= 0.1 ? 4 : 2;
    newTiles.push({ id: uuid(), cords, value });
    tilesToFill -= 1;
  }

  return newTiles;
}

/**
 *
 * @param array dowonlna tablica 2d
 * @returns pełną kopie tablicy
 */
export function copy2DArray<T>(array: T[][]) {
  return array.map((row) => row.map((val) => val));
}

/**
 *
 * @param array dowolna tablica 2d
 * @returns obróconą tablice w lewą stronę
 */
export function rotate2DArrayToLeft<T>(array: T[][]) {
  const rotatedArray: T[][] = [];

  for (let i = array.length - 1; i >= 0; i--) {
    const row: T[] = [];
    for (let j = 0; j < array[i].length; j++) {
      row.push(array[j][i]);
    }
    rotatedArray.push(row);
  }

  return rotatedArray;
}

/**
 *
 * @param array dowolna tablica 2d
 * @param rotationCount liczba obrotów tablicy w lewą strone. np. 2 = 180 stopni w lewo
 * @returns obróconą tablice n-razy
 */
export function rotate2DArrayNTimesToLeft<T>(
  array: T[][],
  rotationCount: number,
) {
  let rotatedArray = copy2DArray(array);

  for (let i = 0; i < rotationCount; i++) {
    rotatedArray = rotate2DArrayToLeft(rotatedArray);
  }

  return rotatedArray!;
}

/**
 *
 * @param cordsArray tablica pozycji kafelków
 * @returns tablice minimalnych kafelków do renderu
 */
export function createDefaultRenderArray(row: Tile[]): RenderTile[] {
  return row.map((tile) => {
    return { id: tile.id, cords: tile.cords, value: 0 };
  });
}

/**
 *
 * @param board zwykła plansza z kafelkami
 * @returns plansze do renderu
 */
export function createRenderBoardFromNormalBoard(board: Board): RenderBoard {
  return board.map((row) => {
    return row.map((tile) => {
      return { ...tile };
    });
  });
}

/**
 *
 * @param board tablica 2d kafelków
 * @param direction kierunek w którym przesuwane są kafelki
 * @returns tablice, która jest używana do wyrenderowania animacji
 */
export function createRenderArray(board: Board, direction: MoveDirection) {
  const rotationCount = mappedRotations.get(direction)!;
  const rb: RenderBoard = [];
  const b = rotate2DArrayNTimesToLeft(board, rotationCount);

  for (let i = 0; i < b.length; i++) {
    let firstFreeIndex = 0;
    let skipNext = false;

    const rbRow = createDefaultRenderArray(board[i]);
    const trimmedRow = b[i].filter((tile) => tile.value !== 0);
    const lastIndex = trimmedRow.length - 1;

    for (const [tileIndex, tile] of trimmedRow.entries()) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const sameValueAsNext =
        tileIndex !== lastIndex &&
        trimmedRow[tileIndex + 1].value === tile.value;

      // check for merge
      if (sameValueAsNext && tile.value !== 0) {
        const nextTile = trimmedRow[tileIndex + 1];

        rbRow[firstFreeIndex].isMerged = tile.cords;
        rbRow[firstFreeIndex].value = nextTile.value * 2;
        rbRow[firstFreeIndex].from = nextTile.cords;
        rbRow[firstFreeIndex].id = nextTile.id;
        skipNext = true;
        firstFreeIndex += 1;
      }

      // just move
      else {
        rbRow[firstFreeIndex].value = tile.value;
        rbRow[firstFreeIndex].from = tile.cords;
        rbRow[firstFreeIndex].id = tile.id;
        firstFreeIndex += 1;
      }
    }

    rb.push(rbRow);
  }

  return rotate2DArrayNTimesToLeft(rb, 4 - rotationCount);
}

/**
 *
 * @param renderBoard plansza do wyrenderowania
 * @returns zwykłą tablicę
 */
export function createNormalBoardFromRenderBoard(
  renderBoard: RenderBoard,
): Board {
  const board: Board = [];
  for (let i = 0; i < renderBoard.length; i++) {
    const row: Tile[] = [];
    for (let j = 0; j < renderBoard[i].length; j++) {
      const { id, value } = renderBoard[i][j];
      const cords = { x: i, y: j };
      row.push({ id, cords, value });
    }
    board.push(row);
  }

  return board;
}

export function addTileToBothBoards(
  newTiles: Tile[],
  board: Board,
  renderBoard: RenderBoard,
) {
  newTiles.forEach(({ id, cords, value }) => {
    board[cords.x][cords.y] = { id, cords, value };
    renderBoard[cords.x][cords.y] = { id, cords, value, isNew: true };
  });
}

export function getBGClassName(num: number) {
  if (num <= 2048) return `bg_${num}`;
  else return `bg_4096`;
}

export function areTwoBoardsEqual(oldBoard: Board, newBoard: Board): boolean {
  for (let i = 0; i < oldBoard.length; i++) {
    for (let j = 0; j < oldBoard[i].length; j++) {
      if (oldBoard[i][j].value !== newBoard[i][j].value) return false;
    }
  }
  return true;
}

export function areAllTilesFilled(board: Board): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j].value) return false;
    }
  }
  return true;
}

export function areAnyTilesIncludeCertainValue(
  board: Board,
  value: number,
): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].value === value) return true;
    }
  }
  return false;
}

export function isGameOver(board: Board, mode: GameMode): boolean {
  if (mode === "limited" && areAnyTilesIncludeCertainValue(board, 2048)) {
    return true;
  }

  if (!areAllTilesFilled(board)) return false;

  const dirs: MoveDirection[] = ["to-left", "to-bottom", "to-right", "to-top"];
  for (const direction of dirs) {
    const virtualRenderBoard = createRenderArray(board, direction);
    const virtualBoard = createNormalBoardFromRenderBoard(virtualRenderBoard);
    if (!areTwoBoardsEqual(virtualBoard, board)) return false;
  }

  return true;
}

export function getMoveScore(renderBoard: RenderBoard) {
  let score = 0;
  renderBoard.forEach((row) => {
    row.forEach((tile) => {
      if (tile.isMerged) {
        score += tile.value / 2;
      }
    });
  });

  return score;
}
