import { CrossDirection, EMPTY, Mark, SIZE, Tile } from "../context";
import {
  getCols,
  getCrossDown,
  getCrossUp,
  getEmptyTiles,
  getRandomEmptyTile,
} from "./utils";

import copy2dArray from "@/utils/copy2dArray";

type TilesLine = { arr: Tile[]; dir: CrossDirection };
type BotReturnType = { x: number; y: number } | null;

export function getMoveOfHardBot(
  board: Tile[][],
  playerMark: Mark
): BotReturnType {
  const { winningLines, linesInDanger } = getWinningAndInDangerLines(
    board,
    playerMark
  );

  // #0 try to win
  if (winningLines.length > 0) {
    const randomLineIndex = Math.floor(Math.random() * winningLines.length);
    const emptyTile = winningLines[randomLineIndex].arr.find(
      (tile) => tile.mark === EMPTY
    )!;
    return emptyTile.pos;
  }

  // #1 getting marks in danger and placing there own marks
  if (linesInDanger.length > 0) {
    const randomLineIndex = Math.floor(Math.random() * linesInDanger.length);
    const emptyTile = linesInDanger[randomLineIndex].arr.find(
      (tile) => tile.mark === EMPTY
    )!;
    return emptyTile.pos;
  }

  // #2 if opponents marks are on opposite corners then place own mark at any empty edge
  const parallelCorners = getParallelCorners();
  for (const { pos1, pos2 } of parallelCorners) {
    const oppositeMark = playerMark === "x" ? "o" : "x";
    if (
      board[pos1.x][pos1.y].mark === oppositeMark &&
      board[pos2.x][pos2.y].mark === oppositeMark
    ) {
      const edges = getEdges(board);
      if (edges.length === 0) continue;
      const randomEdgeIndex = Math.floor(Math.random() * edges.length);
      return edges[randomEdgeIndex].pos;
    }
  }

  // #3 making move if not in danger
  const linesToComplete = getLinesWithOneOwnMark(board, playerMark);
  if (linesToComplete.length > 0) {
    const randomLineIndex = Math.floor(Math.random() * linesToComplete.length);
    const emptyTile = linesToComplete[randomLineIndex].arr.find(
      (tile) => tile.mark === EMPTY
    )!;
    return emptyTile.pos;
  }

  // #4 if opponent place mark in center then place own mark in random corner
  const midIndex = Math.floor(SIZE / 2);
  const midTile = board[midIndex][midIndex];
  if (midTile.mark !== EMPTY && midTile.mark !== playerMark) {
    const emptyTiles = getEmptyTiles(board);
    const emptyCorners: { x: number; y: number }[] = [];

    for (const tile of emptyTiles) {
      const { x, y } = tile;
      if ((x === 0 || x === SIZE - 1) && (y === 0 || y === SIZE - 1)) {
        emptyCorners.push(tile);
      }
    }

    if (emptyCorners.length > 0) {
      const randomCornerIndex = Math.floor(Math.random() * emptyCorners.length);
      return emptyCorners[randomCornerIndex];
    }
  }

  // #4 if opponent will mark any corner then place own mark on opposite side
  //   const corners = getCorners(board);
  //   for (const cor of corners) {
  //     const oppositeMark = playerMark === "x" ? "o" : "x";
  //     if (cor.mark === oppositeMark) {
  //       const { x, y } = getOppositeCorner(cor.pos.x, cor.pos.y);
  //       if (board[x][y].mark === EMPTY) {
  //         return { x, y };
  //       }
  //     }
  //   }

  // #5 if opponent will mark any corner then place own mark at the middle
  if (midTile.mark === EMPTY) {
    return { x: midIndex, y: midIndex };
  }

  // #5 if opponent has to marks at opposite corners then place own mark at any edge (but not corner)

  return getRandomEmptyTile(board);
}

export function getMoveOfMidBot(board: Tile[][], playerMark: Mark) {
  const hardOrRandomMove = Math.floor(Math.random() * 2) === 0;
  if (hardOrRandomMove) return getMoveOfHardBot(board, playerMark);
  else return getRandomEmptyTile(board);
}

// helpers
function getAllLines(board: Tile[][]) {
  const rows: TilesLine[] = copy2dArray(board).map((tile) => {
    return { arr: tile, dir: "horizontal" };
  });
  const cols: TilesLine[] = getCols(board).map((tile) => {
    return { arr: tile, dir: "horizontal" };
  });
  const crossDown: TilesLine = { arr: getCrossDown(board), dir: "cross-down" };
  const crossUp: TilesLine = { arr: getCrossUp(board), dir: "cross-up" };

  return [...rows, ...cols, crossDown, crossUp];
}

function getWinningAndInDangerLines(board: Tile[][], playerMark: Mark) {
  const linesInDanger: TilesLine[] = [];
  const winningLines: TilesLine[] = [];
  const allLines = getAllLines(board);

  for (const line of allLines) {
    const marks = line.arr.map((tile) => tile.mark);
    const indexOfEmpty = marks.findIndex((mark) => mark === EMPTY);
    if (indexOfEmpty === -1) continue;

    const marksWithOutEmptyTile = marks.filter(
      (_, index) => index !== indexOfEmpty
    );

    if (
      marksWithOutEmptyTile.every(
        (mark) => mark !== playerMark && mark !== EMPTY
      )
    ) {
      linesInDanger.push(line);
    } else if (marksWithOutEmptyTile.every((mark) => mark === playerMark)) {
      winningLines.push(line);
    }
  }

  return { winningLines, linesInDanger };
}

function getLinesWithOneOwnMark(board: Tile[][], playerMark: Mark) {
  const resultLines: TilesLine[] = [];
  const allLines = getAllLines(board);
  const oppositeMark = playerMark === "x" ? "o" : "x";

  for (const line of allLines) {
    const marks = line.arr.map((tile) => tile.mark);
    if (
      marks.includes(EMPTY) &&
      marks.includes(playerMark) &&
      marks.every((mark) => mark !== oppositeMark)
    ) {
      resultLines.push(line);
    }
  }

  return resultLines;
}

function getCorners(board: Tile[][]) {
  const corners: Tile[] = [];
  const [start, end] = [0, SIZE - 1];
  for (const i of [start, end]) {
    for (const j of [start, end]) {
      corners.push(board[i][j]);
    }
  }

  return corners;
}

function getOppositeCorner(x: number, y: number) {
  const [start, end] = [0, SIZE - 1];

  // top-left
  if (x === start && y === start) return { x: end, y: end };
  // top-right
  else if (x === start && y === end) return { x: end, y: start };
  // bottom-right
  else if (x === end && y === end) return { x: start, y: start };
  // bottom-right
  else return { x: start, y: end };
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
    if (board[x][y].mark === EMPTY) edges.push(board[x][y]);
  }

  return edges;
}
