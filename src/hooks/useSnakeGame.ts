import { useCallback, useEffect, useRef, useState } from "react";
import {
  START_TICK_MS,
  MIN_TICK_MS,
  SPEEDUP_PER_FOOD_MS,
  SCORE_PER_LEVEL,
  LEVEL_SPEEDUP_MS,
  MAX_LIVES,
} from "../constants";
import { Direction, Point } from "../types";

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

function centerStart(cols: number, rows: number): Point[] {
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  // Head first, body trailing to the left — starts moving RIGHT, away from its own tail.
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
}

function randomFood(snake: Point[], cols: number, rows: number): Point {
  let point: Point;
  do {
    point = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (snake.some((s) => s.x === point.x && s.y === point.y));
  return point;
}

function levelForScore(score: number): number {
  return Math.floor(score / SCORE_PER_LEVEL) + 1;
}

type GameState = {
  snake: Point[];
  food: Point;
  score: number;
  level: number;
  tickMs: number;
  lives: number;
  isGameOver: boolean;
  flashMessage: string | null;
};

function initialState(cols: number, rows: number): GameState {
  const snake = centerStart(cols, rows);
  return {
    snake,
    food: randomFood(snake, cols, rows),
    score: 0,
    level: 1,
    tickMs: START_TICK_MS,
    lives: MAX_LIVES,
    isGameOver: false,
    flashMessage: null,
  };
}

export function useSnakeGame(cols: number, rows: number) {
  const [state, setState] = useState<GameState>(() => initialState(cols, rows));
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");

  // Keep the latest board size in a ref so the game loop (below) can read
  // it without needing to restart the interval every time it changes.
  const boardRef = useRef({ cols, rows });
  boardRef.current = { cols, rows };

  const changeDirection = useCallback((dir: Direction) => {
    // Ignore a direct reversal (can't turn the snake back into itself).
    if (OPPOSITE[dir] === directionRef.current) return;
    nextDirectionRef.current = dir;
  }, []);

  const restart = useCallback(() => {
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    setState(initialState(boardRef.current.cols, boardRef.current.rows));
  }, []);

  // Main game loop — one tick moves the snake one cell.
  useEffect(() => {
    if (state.isGameOver) return;

    const interval = setInterval(() => {
      directionRef.current = nextDirectionRef.current;
      const dir = directionRef.current;
      const { cols: c, rows: r } = boardRef.current;

      setState((prev) => {
        const head = prev.snake[0];
        const newHead: Point = { x: head.x, y: head.y };
        if (dir === "UP") newHead.y -= 1;
        else if (dir === "DOWN") newHead.y += 1;
        else if (dir === "LEFT") newHead.x -= 1;
        else newHead.x += 1;

        // Wrap around the edges instead of treating them as walls — going
        // off one side brings the snake back in from the opposite side.
        newHead.x = (newHead.x + c) % c;
        newHead.y = (newHead.y + r) % r;

        const hitSelf = prev.snake.some(
          (seg) => seg.x === newHead.x && seg.y === newHead.y
        );

        if (hitSelf) {
          const remainingLives = prev.lives - 1;

          if (remainingLives <= 0) {
            return { ...prev, lives: 0, isGameOver: true, flashMessage: null };
          }

          // Give another chance instead of ending on the first mistake:
          // reset the snake's position but keep the score/level/speed earned.
          const freshSnake = centerStart(c, r);
          return {
            ...prev,
            snake: freshSnake,
            food: randomFood(freshSnake, c, r),
            lives: remainingLives,
            flashMessage: `Oops! ${remainingLives} ${remainingLives === 1 ? "life" : "lives"} left`,
          };
        }

        const ateFood = newHead.x === prev.food.x && newHead.y === prev.food.y;
        const body = ateFood ? prev.snake : prev.snake.slice(0, -1);
        const newSnake = [newHead, ...body];

        if (!ateFood) {
          return { ...prev, snake: newSnake, flashMessage: null };
        }

        const newScore = prev.score + 1;
        const newLevel = levelForScore(newScore);
        const leveledUp = newLevel !== prev.level;

        let newTick = Math.max(MIN_TICK_MS, prev.tickMs - SPEEDUP_PER_FOOD_MS);
        if (leveledUp) {
          newTick = Math.max(MIN_TICK_MS, newTick - LEVEL_SPEEDUP_MS);
        }

        return {
          ...prev,
          snake: newSnake,
          food: randomFood(newSnake, c, r),
          score: newScore,
          level: newLevel,
          tickMs: newTick,
          flashMessage: leveledUp ? `Level ${newLevel}!` : null,
        };
      });
    }, state.tickMs);

    return () => clearInterval(interval);
  }, [state.tickMs, state.isGameOver]);

  // Track high score whenever score changes.
  useEffect(() => {
    setHighScore((h) => Math.max(h, state.score));
  }, [state.score]);

  // Clear a transient flash message ("Level 2!", "Oops! 2 lives left") after a moment.
  useEffect(() => {
    if (!state.flashMessage) return;
    const timeout = setTimeout(() => {
      setState((prev) => (prev.flashMessage ? { ...prev, flashMessage: null } : prev));
    }, 1200);
    return () => clearTimeout(timeout);
  }, [state.flashMessage]);

  return {
    snake: state.snake,
    food: state.food,
    score: state.score,
    level: state.level,
    lives: state.lives,
    highScore,
    isGameOver: state.isGameOver,
    flashMessage: state.flashMessage,
    changeDirection,
    restart,
  };
}
