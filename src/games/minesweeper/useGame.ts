import { create } from "zustand";
import { Board, Cords, Difficulty } from "./types";
import { persist } from "zustand/middleware";
import {
  createBoardWithMines,
  revealBoardRecursively,
  mappedBoardInfo,
  revealMinesWithDelay,
  isThereWin,
  getLostFlags,
} from "./utils";
import { PropsWithChildren, useEffect } from "react";
import { produce } from "immer";
import copy2dArray from "@/utils/copy2dArray";

export type GameState = {
  // default
  id: string;

  // states
  board: Board;
  minesCount: number;
  flagsLeft: number;
  isGameOver: boolean;
  isWin: boolean;
  difficulty: Difficulty;
  isFirstClick: boolean;

  // actions
  revealField(cords: Cords): void;
  toggleFlag(cords: Cords): void;
  restartGame(cords?: Cords): void;
  setDifficulty(difficulty: Difficulty): void;
};

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      // default
      id: "minesweeper",

      // states
      board: [[]],
      minesCount: 0,
      flagsLeft: 0,
      isGameOver: false,
      isWin: false,
      difficulty: "easy",
      isFirstClick: true,

      // actions
      revealField(cords) {
        const { isGameOver, isFirstClick } = get();
        let board = get().board;

        if (isGameOver) return;

        if (isFirstClick) {
          const difficulty = get().difficulty;
          const { size, minesCount } = mappedBoardInfo.get(difficulty)!;
          board = createBoardWithMines(size, minesCount, cords);
          set({ isFirstClick: false, board });
        }

        const [x, y] = cords;
        const clickedField = board[x][y];
        const boardCopy = copy2dArray(board);

        if (clickedField.isFlagged) return;

        if (clickedField.isMine === false) {
          const newBoard = revealBoardRecursively(boardCopy, cords, 0);
          const lostFlags = getLostFlags(newBoard);
          set({ board: newBoard, flagsLeft: get().flagsLeft + lostFlags });
        } else {
          const newBoard = revealMinesWithDelay(boardCopy);
          set({ board: newBoard });
          set({ isGameOver: true });
        }

        if (isThereWin(get().board)) {
          set({ isGameOver: true, isWin: true });
        }
      },

      toggleFlag(cords) {
        const [x, y] = cords;
        const { board, flagsLeft } = get();
        const clickedField = board[x][y];

        if (clickedField.isFlagged) {
          set(
            produce<GameState>((state) => {
              state.board[x][y].isFlagged = false;
              state.flagsLeft += 1;
            }),
          );
        } else if (flagsLeft > 0) {
          set(
            produce<GameState>((state) => {
              state.board[x][y].isFlagged = true;
              state.flagsLeft -= 1;
            }),
          );
        }
      },

      restartGame() {
        const difficulty = get().difficulty;
        const { size, minesCount } = mappedBoardInfo.get(difficulty)!;
        const board = createBoardWithMines(size, minesCount, [1, 1]);
        set(() => ({
          board,
          minesCount,
          flagsLeft: minesCount,
          isGameOver: false,
          isWin: false,
          isFirstClick: true,
        }));
      },

      setDifficulty(difficulty) {
        set({ difficulty });
        get().restartGame();
      },
    }),
    {
      name: "minesweeper-states",
      partialize: (state) => ({ difficulty: state.difficulty }),
    },
  ),
);

export const DifficultyHandler = (props: PropsWithChildren) => {
  const restartGame = useGame().restartGame;

  useEffect(() => {
    restartGame();
  }, []);

  return props.children;
};
