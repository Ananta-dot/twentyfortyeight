import { useState, useEffect } from 'react';
import {
  freshBoard,
  spawnRandomTile,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  has2048,
  canMove,
  SIZE,
} from './game';

export default function App() {
  const [board, setBoard]   = useState(() => freshBoard());
  const [score, setScore]   = useState(0);
  const [status, setStatus] = useState('playing');  

  useEffect(() => {
    function onKey(e) {
      if (status !== 'playing') return;          

      let result = null;
      switch (e.key) {
        case 'ArrowLeft':  result = moveLeft(board);  break;
        case 'ArrowRight': result = moveRight(board); break;
        case 'ArrowUp':    result = moveUp(board);    break;
        case 'ArrowDown':  result = moveDown(board);  break;
        default: return;
      }

      const { board: next, moved, score: gained } = result;
      if (!moved) return;

      e.preventDefault();
      const spawned = spawnRandomTile(next);
      const won  = has2048(spawned);
      const lost = !won && !canMove(spawned);

      setBoard(spawned);
      setScore(s => s + gained);
      if (won)  setStatus('won');
      else if (lost) setStatus('lost');
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [board, status]);

  const reset = () => {
    setBoard(freshBoard());
    setScore(0);
    setStatus('playing');
  };

  const cell =
    'w-20 h-20 flex items-center justify-center text-xl font-bold rounded';

  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center p-6 font-sans relative"
    >
      <h1 className="mb-1">2048</h1>
      <p className="mt-0 text-gray-600">Score: {score}</p>

      <div
        className="grid gap-2 mb-3"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 5rem)`,
          filter: status === 'playing' ? 'none' : 'blur(2px)',
        }}
      >
        {board.map((v, i) => (
          <div
            key={i}
            className={cell}
            style={{
              color: v ? '#776e65' : 'transparent',
              backgroundColor: v ? '#eee4da' : '#cdc1b4',
            }}
          >
            {v || ''}
          </div>
        ))}
      </div>

      <button
        onClick={reset}
        className="bg-gray-800 text-white py-2 px-4 rounded"
      >
        New Game
      </button>

      {status !== 'playing' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(238,228,218,0.9)] gap-3"
        >
          <h2>{status === 'won' ? '🎉 You win!' : 'Game over'}</h2>
          <h2>Score: {score}</h2>
          <button
            onClick={reset}
            className="bg-gray-800 text-white py-2 px-4 rounded"
          >
            Play again
          </button>
        </div>
      )}
    </main>
  );
}
