import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
    gameAreaRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else if (hasStarted) setIsPaused((p) => !p);
        else setHasStarted(true);
        return;
      }

      if (!hasStarted || isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isPaused, gameOver]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [hasStarted, isPaused, gameOver, food, generateFood]);

  return (
    <div id="snake-game-wrapper" className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      {/* Score Header */}
      <div id="score-header" className="w-full flex justify-between items-center mb-6 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl">
        <div className="text-gray-400 font-mono text-sm uppercase tracking-widest flex items-center gap-3">
          Score <span id="score-value" className="text-white text-xl font-display font-medium">{score}</span>
        </div>
        <div id="game-status" className="text-fuchsia-400 font-mono text-xs uppercase tracking-widest">
          {gameOver ? 'Game Over' : isPaused ? 'Paused' : 'Playing'}
        </div>
      </div>

      {/* Game Board */}
      <div
        id="game-board"
        ref={gameAreaRef}
        tabIndex={0}
        className="relative bg-[#050505] border border-white/10 rounded-xl shadow-2xl outline-none overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '500px',
          aspectRatio: '1 / 1',
        }}
      >
        {/* Grid Background */}
        <div 
          id="grid-background"
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Snake & Food */}
        {hasStarted && !gameOver && (
          <>
            <div
              id="food-item"
              className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.8)]"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(food.x * 100) / GRID_SIZE}%`,
                top: `${(food.y * 100) / GRID_SIZE}%`,
                transform: 'scale(0.7)',
              }}
            />

            {snake.map((segment, index) => {
              const isHead = index === 0;
              return (
                <div
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`absolute ${
                    isHead ? 'bg-cyan-400 z-10' : 'bg-cyan-600/80'
                  } rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.4)]`}
                  style={{
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                    left: `${(segment.x * 100) / GRID_SIZE}%`,
                    top: `${(segment.y * 100) / GRID_SIZE}%`,
                    transform: isHead ? 'scale(0.95)' : 'scale(0.85)',
                  }}
                />
              );
            })}
          </>
        )}

        {/* Overlays */}
        <AnimatePresence>
          {(!hasStarted || gameOver || isPaused) && (
            <motion.div 
              id="game-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              {!hasStarted ? (
                <div id="start-screen" className="text-center flex flex-col items-center">
                  <h2 className="text-4xl font-display font-bold text-white mb-8 tracking-tight">
                    Neon Snake
                  </h2>
                  <motion.button
                    id="btn-start-game"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHasStarted(true)}
                    className="px-8 py-4 min-h-[44px] min-w-[44px] bg-cyan-500 text-gray-950 font-display font-medium rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-colors hover:bg-cyan-400"
                  >
                    Start Game
                  </motion.button>
                </div>
              ) : gameOver ? (
                <div id="game-over-screen" className="text-center flex flex-col items-center">
                  <h2 className="text-4xl font-display font-bold text-fuchsia-500 mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                    Game Over
                  </h2>
                  <p className="text-gray-300 font-mono text-lg mb-8">
                    Final Score: <span className="text-white font-bold">{score}</span>
                  </p>
                  <motion.button
                    id="btn-play-again"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="px-8 py-4 min-h-[44px] min-w-[44px] bg-fuchsia-500 text-white font-display font-medium rounded-full shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-colors hover:bg-fuchsia-400"
                  >
                    Play Again
                  </motion.button>
                </div>
              ) : isPaused ? (
                <div id="pause-screen" className="text-center flex flex-col items-center">
                  <h2 className="text-3xl font-display font-bold text-white mb-8 tracking-tight">
                    Paused
                  </h2>
                  <motion.button
                    id="btn-resume-game"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-4 min-h-[44px] min-w-[44px] bg-white/10 text-white font-display font-medium rounded-full hover:bg-white/20 transition-colors border border-white/10"
                  >
                    Resume
                  </motion.button>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div id="game-instructions" className="mt-6 text-gray-500 font-mono text-xs uppercase tracking-widest text-center">
        Use Arrow Keys or WASD to move. Space to pause.
      </div>
    </div>
  );
}
