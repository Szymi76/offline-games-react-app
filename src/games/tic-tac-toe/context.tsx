import {
  checkIfGameShouldEnd,
  checkIfThereIsDraw,
  createInitialBoard,
  getRandomEmptyTile,
  validMove,
} from "./funcs/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { getMoveOfHardBot, getMoveOfMidBot } from "./funcs/bots";

import copy2dArray from "@/utils/copy2dArray";
import { useImmer } from "use-immer";
import { useLocalStorage } from "react-use";
import wait from "@/utils/wait";

export const EMPTY = "empty";
export const SIZE = 3;

export type CrossDirection =
  | "cross-down"
  | "cross-up"
  | "vertical"
  | "horizontal";
export type Mark = "x" | "o";
export type Tile = {
  pos: { x: number; y: number };
  mark: Mark | typeof EMPTY;
  isCrossed: boolean;
  crossDirection: CrossDirection | undefined;
};
export type GameState = "started" | "ended" | "waiting";
export type GameMode = "easy" | "medium" | "hard";
export type Score = { played: number; won: number };

type GameContextType = {
  // states
  board: Tile[][];
  state: GameState;
  mode: GameMode;
  score: Score | undefined;
  playerMark: Mark;
  turn: Mark | null;
  isDraw: boolean;
  isEnded: { value: boolean; whoWon: Mark | null };

  // actions
  chooseMarkAndStartGame: (mark: Mark) => void;
  makeMove: (x: number, y: number, mark: Mark) => { valid: boolean };
  changeMode: (gameMode: GameMode) => void;
  restart: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

const initialScore: GameContextType["score"] = { played: 0, won: 0 };
const initialBoard = createInitialBoard(SIZE);

type GameProviderProps = { children: React.ReactNode };
export const GameProvider = (props: GameProviderProps) => {
  const [board, setBoard] = useImmer<GameContextType["board"]>(initialBoard);
  const [state, setState] = useState<GameContextType["state"]>("started");
  const [mode, setMode] = useState<GameContextType["mode"]>("medium");
  const [score, setScore] = useLocalStorage<GameContextType["score"]>(
    "tic-tac-toe_score",
    initialScore
  );
  const [playerMark, setPlayerMark] =
    useState<GameContextType["playerMark"]>("x");
  const [turn, setTurn] = useState<GameContextType["turn"]>("x");
  const [isDraw, setIsDraw] = useState<GameContextType["isDraw"]>(false);
  const [isEnded, setIsEnded] = useState<GameContextType["isEnded"]>({
    value: false,
    whoWon: null,
  });

  useEffect(() => {
    wait(1000).then(() => {
      const botMark = playerMark === "x" ? "o" : "x";
      let pos: { x: number; y: number } | null = null;

      if (mode === "easy") pos = getRandomEmptyTile(board);
      else if (mode === "medium") pos = getMoveOfMidBot(board, botMark);
      else pos = getMoveOfHardBot(board, botMark);

      if (pos !== null) makeMove(pos.x, pos.y, botMark);
    });
  }, [turn, playerMark, isEnded]);

  const chooseMarkAndStartGame: GameContextType["chooseMarkAndStartGame"] = (
    mark
  ) => {
    restart();
    setPlayerMark(mark);
  };

  const makeMove: GameContextType["makeMove"] = (x, y, mark) => {
    let snapshot: Tile[][] = copy2dArray(board);
    const argX = x;
    const argY = y;

    if (state !== "started") return { valid: false };
    const isMoveValid = validMove(x, y, mark, turn, board);
    if (!isMoveValid) return { valid: false };

    snapshot[x][y].mark = mark;

    setTurn((currTurn) => {
      return currTurn === "x" ? "o" : "x";
    });

    const endCheckResult = checkIfGameShouldEnd(snapshot);

    if (typeof endCheckResult !== "boolean") {
      const { crossDir, winningMark, pos } = endCheckResult;
      const currPlayerWon = winningMark === playerMark;

      // updating states
      setState("ended");
      const newScore = {
        played: score!.played + 1,
        won: currPlayerWon ? score!.won + 1 : score!.won,
      };
      setScore(newScore);
      setIsEnded({ value: true, whoWon: winningMark });

      // settings crossings
      if (crossDir === "horizontal") {
        const x = pos!.x!;
        setBoard((draftBoard) => {
          draftBoard[argX][argY].mark = mark;
          for (let i = 0; i < draftBoard[x].length; i++) {
            draftBoard[x][i].isCrossed = true;
            draftBoard[x][i].crossDirection = "horizontal";
          }
        });
      }

      if (crossDir === "vertical") {
        const y = pos!.y!;
        setBoard((draftBoard) => {
          draftBoard[argX][argY].mark = mark;
          for (let i = 0; i < draftBoard.length; i++) {
            draftBoard[i][y].isCrossed = true;
            draftBoard[i][y].crossDirection = "vertical";
          }
        });
      }

      if (crossDir === "cross-down") {
        const boardLength = board.length;

        setBoard((draftBoard) => {
          let [i, j] = [0, 0];
          draftBoard[argX][argY].mark = mark;
          while (i < boardLength && j < boardLength) {
            draftBoard[i][j].isCrossed = true;
            draftBoard[i][j].crossDirection = "cross-down";
            i += 1;
            j += 1;
          }
        });
      }

      if (crossDir === "cross-up") {
        const boardLength = board.length;

        setBoard((draftBoard) => {
          let [i, j] = [boardLength - 1, 0];
          draftBoard[argX][argY].mark = mark;
          while (i >= 0 && j < boardLength) {
            draftBoard[i][j].isCrossed = true;
            draftBoard[i][j].crossDirection = "cross-up";
            i -= 1;
            j += 1;
          }
        });
      }

      return { valid: true };
    } else {
      setBoard((draftBoard) => {
        draftBoard[argX][argY].mark = mark;
      });
    }

    // must be placed after checkIfGameShouldEnd!
    if (checkIfThereIsDraw(snapshot)) {
      setState("ended");
      const newScore = { ...score!, played: score!.played + 1 };
      setScore(newScore);
      setIsDraw(true);
    }

    return { valid: true };
  };

  const changeMode: GameContextType["changeMode"] = (gameMode) => {
    setMode(gameMode);
  };

  const restart: GameContextType["restart"] = () => {
    setBoard(initialBoard);
    setState("started");
    setTurn("x");
    setIsDraw(false);
    setIsEnded({ value: false, whoWon: null });
  };

  const value: GameContextType = {
    board,
    state,
    mode,
    score,
    playerMark,
    turn,
    isDraw,
    isEnded,
    chooseMarkAndStartGame,
    makeMove,
    changeMode,
    restart,
  };

  return (
    <GameContext.Provider value={value}>{props.children}</GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame hook was used outside of <GameProvider />!");
  }

  return context;
};
