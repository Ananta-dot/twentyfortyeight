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

  const cellBase =
    'w-20 h-20 flex items-center justify-center text-xl font-bold rounded shadow';
  const tileStyles = {
    0: 'bg-[#cdc1b4] text-transparent',
    2: 'bg-[#eee4da] text-[#776e65]',
    4: 'bg-[#ede0c8] text-[#776e65]',
    8: 'bg-[#f2b179] text-white',
    16: 'bg-[#f59563] text-white',
    32: 'bg-[#f67c5f] text-white',
    64: 'bg-[#f65e3b] text-white',
    128: 'bg-[#edcf72] text-white',
    256: 'bg-[#edcc61] text-white',
    512: 'bg-[#edc850] text-white',
    1024: 'bg-[#edc53f] text-white text-lg',
    2048: 'bg-[#edc22e] text-white text-lg',
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center p-6 font-sans bg-gray-100 relative"
    >
      <h1 className="mb-1">2048</h1>
      <p className="mt-0 text-gray-600">Score: {score}</p>

      <div
        className={`grid gap-2 mb-3 bg-[#bbada0] p-2 rounded ${
          status !== 'playing' ? 'blur-sm' : ''
        }`}
        style={{ gridTemplateColumns: `repeat(${SIZE}, 5rem)` }}
      >
        {board.map((v, i) => (
          <div
            key={i}
            className={`${cellBase} ${tileStyles[v] || tileStyles[0]}`}
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
          className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(238,228,218,0.9)] gap-3 text-center"
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
