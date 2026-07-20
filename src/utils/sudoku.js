const range = Array.from({ length: 9 }, (_, i) => i)
const shuffle = a => [...a].sort(() => Math.random() - .5)
export function valid(board, row, col, value) {
  for (let i = 0; i < 9; i++) if (board[row][i] === value || board[i][col] === value) return false
  const r = row - row % 3, c = col - col % 3
  for (let y = r; y < r + 3; y++) for (let x = c; x < c + 3; x++) if (board[y][x] === value) return false
  return true
}
function solve(board) {
  for (const r of range) for (const c of range) if (!board[r][c]) {
    for (const n of shuffle(range.map(x => x + 1))) if (valid(board, r, c, n)) { board[r][c] = n; if (solve(board)) return true; board[r][c] = 0 }
    return false
  }
  return true
}
function countSolutions(board, count = 0) {
  for (const r of range) for (const c of range) if (!board[r][c]) {
    for (let n = 1; n <= 9; n++) if (valid(board, r, c, n)) { board[r][c] = n; count = countSolutions(board, count); board[r][c] = 0; if (count > 1) return count }
    return count
  }
  return count + 1
}
const clues = { easy: 42, intermediate: 35, hard: 29, master: 24 }
export function createPuzzle(difficulty = 'easy') {
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0)); solve(solution)
  const puzzle = solution.map(row => [...row]); const cells = shuffle(range.flatMap(r => range.map(c => [r, c])))
  let remaining = 81
  for (const [r, c] of cells) { if (remaining <= clues[difficulty]) break; const hold = puzzle[r][c]; puzzle[r][c] = 0; if (countSolutions(puzzle.map(x => [...x])) !== 1) puzzle[r][c] = hold; else remaining-- }
  return { puzzle, solution }
}
