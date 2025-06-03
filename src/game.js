export const SIZE = 4;                  // 4 × 4 board

const emptyBoard = () => Array(SIZE * SIZE).fill(0);

export function randomEmptyCell(board) {
  const empties = board
    .map((v, i) => (v === 0 ? i : null))
    .filter(i => i !== null);
  return empties.length
    ? empties[Math.floor(Math.random() * empties.length)]
    : undefined;
}

export function freshBoard() {
  const b = emptyBoard();
  for (let i = 0; i < 2; i++) {
    const idx = randomEmptyCell(b);
    b[idx] = Math.random() < 0.9 ? 2 : 4;
  }
  return b;
}

export function spawnRandomTile(board) {
  const idx = randomEmptyCell(board);
  if (idx === undefined) return board;      
  const out = [...board];
  out[idx] = Math.random() < 0.9 ? 2 : 4;
  return out;
}

export function slideRowLeft(row) {
  const compact = row.filter(v => v !== 0);
  const out = [];
  let score = 0;

  for (let i = 0; i < compact.length; i++) {
    if (compact[i] === compact[i + 1]) {
      const merged = compact[i] * 2;
      out.push(merged);
      score += merged;
      i++;                             
    } else {
      out.push(compact[i]);
    }
  }
  while (out.length < row.length) out.push(0);
  const moved = out.some((v, i) => v !== row[i]);
  return { row: out, moved, score };
}

export function moveLeft(board) {
  let moved = false;
  let totalScore = 0;
  const next = [...board];

  for (let r = 0; r < SIZE; r++) {
    const slice = board.slice(r * SIZE, r * SIZE + SIZE);
    const { row, moved: rowMoved, score } = slideRowLeft(slice);
    if (rowMoved) moved = true;
    totalScore += score;
    for (let c = 0; c < SIZE; c++) next[r * SIZE + c] = row[c];
  }
  return { board: next, moved, score: totalScore };
}

const idx = (r, c) => r * SIZE + c;

export function reverseRows(b) {
  const out = [...b];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE / 2; c++) {
      const i = idx(r, c), j = idx(r, SIZE - 1 - c);
      [out[i], out[j]] = [out[j], out[i]];
    }
  }
  return out;
}

export function transpose(b) {
  const out = [...b];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < r; c++) {
      const i = idx(r, c), j = idx(c, r);
      [out[i], out[j]] = [out[j], out[i]];
    }
  }
  return out;
}

export function moveRight(board) {
  const flip = reverseRows(board);
  const res  = moveLeft(flip);
  return { ...res, board: reverseRows(res.board) };
}

export function moveUp(board) {
  const t   = transpose(board);
  const res = moveLeft(t);
  return { ...res, board: transpose(res.board) };
}

export function moveDown(board) {
  const tFlip = reverseRows(transpose(board));
  const res   = moveLeft(tFlip);
  const after = transpose(reverseRows(res.board));
  return { ...res, board: after };
}

export function has2048(board) {
    return board.some(v => v === 2048);
  }
  
  export function canMove(board) {
    if (board.some(v => v === 0)) return true;    
  
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cur = board[idx(r, c)];
        if (
          (c + 1 < SIZE && cur === board[idx(r, c + 1)]) ||
          (r + 1 < SIZE && cur === board[idx(r + 1, c)])
        ) {
          return true;                            
        }
      }
    }
    return false;                             
  }