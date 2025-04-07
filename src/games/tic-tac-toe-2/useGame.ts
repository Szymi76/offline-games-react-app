import { create } from "zustand";
import { Board, Score, Side, AiMode, Tile } from "./types";
import {
  createInitialBoard,
  getOppositeSide,
  getWinningTiles,
  checkIfThereIsDraw,
  getRandomEmptyTile,
} from "./utils";
import { produce } from "immer";
import wait from "@/utils/wait";
import { useEffect } from "react";
import { getCordsOfHardAiMove, getCordsOfMediumAiMove } from "./utils/ai";
import { persist, createJSONStorage } from "zustand/middleware";

export type GameState = {
  // default
  id: string;

  // states
  board: Board;
  turn: Side;
  result: {
    gameState: "before-game" | "ongoing" | "finished";
    isDraw: boolean;
    IsWin: boolean;
    winner?: Side;
  };
  side: { player: Side; ai: Side };
  score: Score;
  aiMode: AiMode;

  // methods
  changeSide(playerSide: Side): void;
  changeAiMode(mode: AiMode): void;
  startNewGame(): void;
  makeMove(tile: Tile, side: Side): void;
};

const INITIAL_RESULT: GameState["result"] = {
  gameState: "before-game",
  isDraw: false,
  IsWin: false,
};
const INITIAL_BOARD = createInitialBoard();

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      // default
      id: "tic-tac-toe",

      // states
      board: INITIAL_BOARD,
      turn: "x",
      result: INITIAL_RESULT,
      side: { player: "x", ai: "o" },
      score: { player: 0, ai: 0 },
      aiMode: "medium",

      // methods
      changeSide(playerSide: Side) {
        const aiSide = getOppositeSide(playerSide);
        set({ side: { player: playerSide, ai: aiSide } });
        get().startNewGame();
      },

      changeAiMode(mode: AiMode) {
        set({ aiMode: mode });
      },

      startNewGame() {
        set({
          board: INITIAL_BOARD,
          turn: "x",
          result: { ...INITIAL_RESULT, gameState: "ongoing" },
        });
      },

      makeMove: (tile: Tile, side: Side) => {
        const gameState = get().result.gameState;
        const isAiMode = side === get().side.ai;

        if (gameState === "before-game") {
          set(
            produce((state) => {
              state.result.gameState = "ongoing";
            }),
          );
        }

        if (gameState === "finished") return;

        const [x, y] = tile.cords;
        const initialBoard = get().board;
        const tileInBoard = initialBoard[x][y];
        const currentTurn = get().turn;

        const isTileEmpty = tileInBoard.side === null;
        const isTurnValid = currentTurn === tile.side;

        if (!isTileEmpty || !isTurnValid) return;

        set(
          produce<GameState>((state) => {
            state.board[x][y].side = tile.side;
            state.turn = getOppositeSide(side);
          }),
        );

        const winningTiles = getWinningTiles(get().board);
        const isThereDraw = checkIfThereIsDraw(get().board);

        if (!winningTiles && !isThereDraw) return;

        if (isThereDraw && !winningTiles) {
          set({
            result: { gameState: "finished", isDraw: true, IsWin: false },
          });
          return;
        }

        set(
          produce<GameState>((state) => {
            winningTiles!.forEach((tile) => {
              const [tileX, tileY] = tile.cords;
              state.board[tileX][tileY].isWinningTile = true;
            });
            state.result = {
              gameState: "finished",
              IsWin: true,
              winner: currentTurn,
              isDraw: false,
            };
            if (isAiMode) state.score.ai++;
            else state.score.player++;
          }),
        );
      },
    }),
    {
      name: "tic-tac-toe-states",
      partialize: (state) => ({ aiMode: state.aiMode }),
    },
  ),
);

export const AIHandler = (props: React.PropsWithChildren) => {
  const { turn, side, makeMove, board, result, aiMode } = useGame();

  useEffect(() => {
    if (side.ai === turn) {
      wait(1000).then(() => {
        let cords = getRandomEmptyTile(board);
        if (aiMode === "medium") cords = getCordsOfMediumAiMove(board, side.ai);
        if (aiMode === "hard") cords = getCordsOfHardAiMove(board, side.ai);

        if (!cords) return;

        const tile: Tile = {
          cords,
          isWinningTile: false,
          side: turn,
        };
        makeMove(tile, turn);
      });
    }
  }, [turn, side, result]);

  return props.children;
};
