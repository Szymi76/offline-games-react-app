import {
  getCols,
  getCrossDown,
  getCrossUp,
  getEmptyTiles,
  getOppositeSide,
  getRandomEmptyTile,
} from ".";
import { Board, SIZE, Side, Tile } from "../types";

export function getCordsOfHardAiMove(
  board: Board,
  playerSide: Side,
): Tile["cords"] | null {
  const { winningLines, linesInDanger } = getWinningAndInDangerLines(
    board,
    playerSide,
  );

  // #0 try to win
  if (winningLines.length > 0) {
    const randomLineIndex = Math.floor(Math.random() * winningLines.length);
    const emptyTile = winningLines[randomLineIndex].find(
      (tile) => tile.side === null,
    )!;
    return emptyTile.cords;
  }

  // #1 getting marks in danger and placing there own marks
  if (linesInDanger.length > 0) {
    const randomLineIndex = Math.floor(Math.random() * linesInDanger.length);
    const emptyTile = linesInDanger[randomLineIndex].find(
      (tile) => tile.side === null,
    )!;
    return emptyTile.cords;
  }

  // #2 if opponents marks are on opposite corners then place own mark at any empty edge
  const parallelCorners = getParallelCorners();
  for (const { pos1, pos2 } of parallelCorners) {
    const oppositeSide = playerSide === "x" ? "o" : "x";
    if (
      board[pos1.x][pos1.y].side === oppositeSide &&
      board[pos2.x][pos2.y].side === oppositeSide
    ) {
      const edges = getEdges(board);
      if (edges.length === 0) continue;
      const randomEdgeIndex = Math.floor(Math.random() * edges.length);
      return edges[randomEdgeIndex].cords;
    }
  }

  // #3 making move if not in danger
  const linesToComplete = getLinesWithOneOwnMark(board, playerSide);
  if (linesToComplete.length > 0) {
    const randomLineIndex = Math.floor(Math.random() * linesToComplete.length);
    const emptyTile = linesToComplete[randomLineIndex].find(
      (tile) => tile.side === null,
    )!;
    return emptyTile.cords;
  }

  // #4 if opponent place mark in center then place own mark in random corner
  const midIndex = Math.floor(SIZE / 2);
  const midTile = board[midIndex][midIndex];
  if (midTile.side !== null && midTile.side !== playerSide) {
    const emptyTiles = getEmptyTiles(board);
    const emptyCorners: Tile["cords"][] = [];

    for (const tile of emptyTiles) {
      const [x, y] = tile;
      if ((x === 0 || x === SIZE - 1) && (y === 0 || y === SIZE - 1)) {
        emptyCorners.push(tile);
      }
    }

    if (emptyCorners.length > 0) {
      const randomCornerIndex = Math.floor(Math.random() * emptyCorners.length);
      return emptyCorners[randomCornerIndex];
    }
  }

  // #5 if opponent will mark any corner then place own mark at the middle
  if (midTile.side === null) {
    return [midIndex, midIndex];
  }

  // #6 if opponent has to marks at opposite corners then place own mark at any edge (but not corner)
  return getRandomEmptyTile(board);
}

export function getCordsOfMediumAiMove(
  board: Board,
  playerSide: Side,
): Tile["cords"] | null {
  const hardOrRandomMove = Math.floor(Math.random() * 2) === 0;
  if (hardOrRandomMove) return getCordsOfHardAiMove(board, playerSide);
  else return getRandomEmptyTile(board);
}

// helpers
function getAllLines(board: Board) {
  const rows = board;
  const cols = getCols(board);
  const crossDown = getCrossDown(board);
  const crossUp = getCrossUp(board);

  return [...rows, ...cols, crossDown, crossUp];
}

function getWinningAndInDangerLines(board: Tile[][], playerSide: Side) {
  const linesInDanger: Tile[][] = [];
  const winningLines: Tile[][] = [];
  const allLines = getAllLines(board);

  for (const line of allLines) {
    const marks = line.map((tile) => tile.side);
    const indexOfEmpty = marks.findIndex((side) => side === null);
    if (indexOfEmpty === -1) continue;

    const marksWithOutEmptyTile = marks.filter(
      (_, index) => index !== indexOfEmpty,
    );

    if (
      marksWithOutEmptyTile.every(
        (side) => side !== playerSide && side !== null,
      )
    ) {
      linesInDanger.push(line);
    } else if (marksWithOutEmptyTile.every((side) => side === playerSide)) {
      winningLines.push(line);
    }
  }

  return { winningLines, linesInDanger };
}

function getLinesWithOneOwnMark(board: Tile[][], playerSide: Side) {
  const resultLines: Tile[][] = [];
  const allLines = getAllLines(board);
  const oppositeSide = getOppositeSide(playerSide);

  for (const line of allLines) {
    const marks = line.map((tile) => tile.side);
    if (
      marks.includes(null) &&
      marks.includes(playerSide) &&
      marks.every((side) => side !== oppositeSide)
    ) {
      resultLines.push(line);
    }
  }

  return resultLines;
}

function getParallelCorners() {
  const [start, end] = [0, SIZE - 1];

  return [
    { pos1: { x: start, y: start }, pos2: { x: end, y: end } },
    { pos1: { x: start, y: end }, pos2: { x: end, y: start } },
  ];
}

function getEdges(board: Tile[][]) {
  const [start, mid, end] = [0, Math.floor(SIZE / 2), SIZE - 1];
  const edges: Tile[] = [];

  const indexArr = [
    [start, mid],
    [mid, end],
    [end, mid],
    [mid, start],
  ];
  for (const [x, y] of indexArr) {
    if (board[x][y].side === null) edges.push(board[x][y]);
  }

  return edges;
}
