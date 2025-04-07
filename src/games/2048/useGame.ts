import { Board, GameMode, MoveDirection, RenderBoard } from "./types";
import {
  addTileToBothBoards,
  areTwoBoardsEqual,
  createInitialBoard,
  createNormalBoardFromRenderBoard,
  createRenderArray,
  createRenderBoardFromNormalBoard,
  getMoveScore,
  getRandomTiles,
  isGameOver,
} from "./utils";

import { create } from "zustand";
import { produce } from "immer";
import { persist } from "zustand/middleware";

type GameState = {
  // default
  id: string;

  // states
  board: Board;
  renderBoard: RenderBoard;
  mode: GameMode;
  isGameEnded: boolean;
  score: { max: number; current: number };

  // actions
  makeMove: (direction: MoveDirection) => void;
  changeMode: (gameMode: GameMode) => void;
  startNewGame: () => void;
};

const initialBoard = createInitialBoard(4);
const randomTiles = getRandomTiles(initialBoard, 3);

const initialRenderBoard = createRenderBoardFromNormalBoard(initialBoard);
addTileToBothBoards(randomTiles, initialBoard, initialRenderBoard);

const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      // default
      id: "2048",

      // states
      board: initialBoard,
      renderBoard: initialRenderBoard,
      mode: "limited",
      isGameEnded: false,
      score: { current: 0, max: 0 },

      // methods
      makeMove: (direction) => {
        const board = get().board;
        const newRenderBoard = createRenderArray(board, direction);
        const newBoard = createNormalBoardFromRenderBoard(newRenderBoard);

        if (!areTwoBoardsEqual(board, newBoard)) {
          const newRandomTile = getRandomTiles(newBoard);
          addTileToBothBoards(newRandomTile, newBoard, newRenderBoard);
        }

        const moveScore = getMoveScore(newRenderBoard);

        set(
          produce<GameState>((state) => {
            state.board = newBoard;
            state.renderBoard = newRenderBoard;
            state.score.current += moveScore;
          }),
        );

        if (isGameOver(newBoard, get().mode)) {
          set(
            produce<GameState>((state) => {
              state.score.max = Math.max(state.score.current, state.score.max);
              state.isGameEnded = true;
              state.score.current = 0;
            }),
          );
        }
      },

      changeMode: (gameMode) => {
        set(() => ({
          mode: gameMode,
          isGameEnded: gameMode === "unlimited" ? false : get().isGameEnded,
        }));
      },

      startNewGame: () => {
        const board = createInitialBoard(4);
        const tiles = getRandomTiles(board, 3);
        const renderBoard = createRenderBoardFromNormalBoard(board);
        addTileToBothBoards(tiles, board, renderBoard);

        set(
          produce<GameState>((state) => {
            state.board = board;
            state.renderBoard = renderBoard;
            state.isGameEnded = false;
            state.score.current = 0;
          }),
        );
      },
    }),
    {
      name: "2048-states",
      partialize: (state) => ({
        score: { ...state.score, current: 0 },
        mode: state.mode,
      }),
    },
  ),
);

export default useGame;
