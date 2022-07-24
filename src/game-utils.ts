import { BLACK, EMPTY, WHITE } from "./components/Board";
import { GameState, Player } from "./components/Game";

function reshape(board: string[], n: number) {
  const reshaped = [];
  for (let i = 0; i < board.length; i += n) {
    reshaped.push(board.slice(i, i + n));
  }
  return reshaped;
}

function inBounds(i: number, boardSize: number) {
  return i >= 0 && i < boardSize;
}

function isConnected(r: number, c: number, color: string, board: string[][]) {
  const n = board.length;
  return inBounds(r, n) && inBounds(c, n) && (board[r][c] === color || board[r][c] === EMPTY);
}

function tryToCapture(color: string, x: number, y: number, board: string[][]) {
  if (board[x][y] !== color) return false;

  const n = board.length;
  const visited = Array(n).fill(false).map(() => Array(n).fill(false));

  const queue = [] as number[][];
  queue.push([x, y]);
  visited[x][y] = true;

  while (queue.length > 0) {
    const pt = queue.shift() as number[];
    const r = pt[0];
    const c = pt[1];

    if (board[r][c] === EMPTY) {
      return false;
    }

    if (isConnected(r - 1, c, color, board) && !visited[r - 1][c]) {
      queue.push([r - 1, c]);
      visited[r - 1][c] = true;
    }

    if (isConnected(r + 1, c, color, board) && !visited[r + 1][c]) {
      queue.push([r + 1, c]);
      visited[r + 1][c] = true;
    }

    if (isConnected(r, c - 1, color, board) && !visited[r][c - 1]) {
      queue.push([r, c - 1]);
      visited[r][c - 1] = true;
    }

    if (isConnected(r, c + 1, color, board) && !visited[r][c + 1]) {
      queue.push([r, c + 1]);
      visited[r][c + 1] = true;
    }
  }

  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (visited[r][c]) {
        // eslint-disable-next-line no-param-reassign
        board[r][c] = EMPTY;
      }
    }
  }

  return true;
}

function tryToCaptureAll(color: string, r: number, c: number, board: string[][]) {
  const n = board.length;
  if (inBounds(r - 1, n)) tryToCapture(color, r - 1, c, board);
  if (inBounds(r + 1, n)) tryToCapture(color, r + 1, c, board);
  if (inBounds(c - 1, n)) tryToCapture(color, r, c - 1, board);
  if (inBounds(c + 1, n)) tryToCapture(color, r, c + 1, board);
}

function calculateResult(board: string[]) {
  const n = Math.sqrt(board.length);
  const grid = reshape(board, n);
  const visited = Array(n).fill(false).map(() => Array(n).fill(false));
  const queue = [] as number[][];

  let blackPoints = 0;
  let whitePoints = 0;

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === BLACK) {
        blackPoints += 1;
      } else if (grid[i][j] === WHITE) {
        whitePoints += 1;
      } else if (!visited[i][j]) {
        let surroundedByBlack = false;
        let surroundedByWhite = false;

        queue.push([i, j]);
        visited[i][j] = true;

        let territorySize = 0;

        while (queue.length > 0) {
          const pt = queue.shift() as number[];
          const r = pt[0];
          const c = pt[1];

          if (board[r][c] === EMPTY) {
            territorySize += 1;

            if (inBounds(r + 1, n) && !visited[r + 1][c]) {
              queue.push([r + 1, c]);
              visited[r + 1][c] = true;
            }
            if (inBounds(r - 1, n) && !visited[r - 1][c]) {
              queue.push([r - 1, c]);
              visited[r - 1][c] = true;
            }
            if (inBounds(c + 1, n) && !visited[r][c + 1]) {
              queue.push([r, c + 1]);
              visited[r][c + 1] = true;
            }
            if (inBounds(c - 1, n) && !visited[r][c - 1]) {
              queue.push([r, c - 1]);
              visited[r][c - 1] = true;
            }
          } else {
            visited[r][c] = false; // Same stone may need to be visited again by another territory.

            if (board[r][c] === BLACK) {
              surroundedByBlack = true;
            }
            if (board[r][c] === WHITE) {
              surroundedByWhite = true;
            }
          }
        }

        if (surroundedByBlack && !surroundedByWhite) {
          blackPoints += territorySize;
        } else if (surroundedByWhite && !surroundedByBlack) {
          whitePoints += territorySize;
        }
      }
    }
  }
  return { blackPoints, whitePoints };
}

function cloneState(state: GameState) {
  return { ...state, board: state.board.slice() } as GameState;
}

function getVertexFromCoordinate(r: number, c: number) {
  let colLetter;
  if (c >= 8) {
    // There is no I on the board, so shift 9 and onwards up by one
    colLetter = String.fromCharCode(c + 1 + "A".charCodeAt(0));
  } else {
    colLetter = String.fromCharCode(c + "A".charCodeAt(0));
  }

  return colLetter + (r + 1); // Board is one-indexed
}

function getCoordinateFromVertex(vertex: string) {
  let c = vertex.charCodeAt(0) - "A".charCodeAt(0);
  if (c >= 9) c -= 1; // There is no I on the board, so shift J and onwards down by one
  const r = parseInt(vertex.substring(1), 10) - 1; // Board is one-indexed

  return [r, c];
}

function getPlayerColor(player: Player) {
  return player === "BLACK" ? "B" : "W";
}

function flattenIndex(r: number, c: number, n: number) {
  return r * n + c;
}

function getDimensionFromLength(l: number) {
  const n = Math.sqrt(l);
  if (n * n !== l) throw Error("Non-square board size");
  return n;
}

function getOpponent(player: Player) {
  return player === "BLACK" ? "WHITE" : "BLACK";
}

export {
  calculateResult, cloneState, flattenIndex, getCoordinateFromVertex,
  getDimensionFromLength, getOpponent, getPlayerColor, getVertexFromCoordinate,
  inBounds, isConnected, reshape, tryToCapture, tryToCaptureAll,
};
