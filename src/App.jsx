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

  const cell = {
    width: '5rem',
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    borderRadius: 6,
  };

  return (
    <main style={{
      minHeight: '100vh',          // full-height viewport
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',    // vertical center
      alignItems: 'center',        // horizontal center
      padding: 24,
      fontFamily: 'sans-serif',
      position: 'relative',
    }}>
      <h1 style={{ marginBottom: 4 }}>2048</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Score: {score}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${SIZE}, 5rem)`,
          gap: '0.5rem',
          marginBottom: 12,
          filter: status === 'playing' ? 'none' : 'blur(2px)',
        }}
      >
        {board.map((v, i) => (
          <div
            key={i}
            style={{
              ...cell,
              color: v ? '#776e65' : 'transparent',
              backgroundColor: v ? '#eee4da' : '#cdc1b4',
            }}
          >
            {v || ''}
          </div>
        ))}
      </div>

      <button onClick={reset}>New Game</button>

      {status !== 'playing' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(238,228,218,0.9)',
            gap: 12,
          }}
        >
          <h2>{status === 'won' ? '🎉 You win!' : 'Game over'}</h2>
          <h2>Score: {score}</h2>
          <button onClick={reset}>Play again</button>
        </div>
      )}
    </main>
  );
}
