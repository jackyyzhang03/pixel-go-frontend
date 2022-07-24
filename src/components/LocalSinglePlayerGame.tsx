import {
  Alert, AlertIcon, useDisclosure, useToast, VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import {
  calculateResult, cloneState, getCoordinateFromVertex, getDimensionFromLength, getOpponent,
  getPlayerColor, getVertexFromCoordinate, reshape, tryToCapture, tryToCaptureAll,
} from "../game-utils";
import { EMPTY } from "./Board";
import {
  defaultGameState, Game, GameResult, GameState, Player,
} from "./Game";
import { SinglePlayerResultModal } from "./SinglePlayerResultModal";

type Move = {
  player: Player;
  vertex: string;
}

function LocalSinglePlayerGame() {
  const [gameState, setGameState] = useState({ ...defaultGameState, running: true } as GameState);
  const [moves, setMoves] = useState([] as Move[]);
  const [selected, setSelected] = useState(null as number | null);
  const [result, setResult] = useState({} as GameResult);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const { isOpen: isResultModalOpen, onOpen: openResultModal, onClose: closeResultModal } = useDisclosure();

  const executeMove = (move: Move, currentState: GameState, currentMoves: Move[]) => {
    const state = cloneState(currentState);

    if (move.vertex === "PASS") {
      if (state.consecutivePass) {
        state.running = false;
        setResult(calculateResult(state.board));
        openResultModal();
      } else {
        state.consecutivePass = true;
      }
    } else {
      state.consecutivePass = false;

      const [r, c] = getCoordinateFromVertex(move.vertex);
      const color = getPlayerColor(move.player);
      const n = getDimensionFromLength(state.board.length);

      const grid = reshape(state.board, n);
      grid[r][c] = color;

      const opponent = getOpponent(state.currentPlayer);
      tryToCaptureAll(getPlayerColor(opponent), r, c, grid);

      state.board = grid.flat();
      state.currentPlayer = opponent;

      setMoves([...currentMoves, move]);
    }

    setGameState(state);
  };

  const generateMove = (player: Player, state: GameState, currentMoves: Move[]) => {
    setIsLoading(true);
    // eslint-disable-next-line no-useless-concat
    fetch(`http://${process.env.REACT_APP_SERVER_ADDRESS}/engine/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player, moves: currentMoves }),
    })
      .then((response) => {
        if (!response.ok) throw new TypeError("An unknown server error occured.");
        return response.json();
      })
      .then((move: Move) => executeMove(move, state, currentMoves))
      .then(() => setIsLoading(false))
      .catch((error: TypeError) => {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      });
  };

  const placeStone = () => {
    if (selected === null || gameState.board[selected] !== EMPTY) return;

    const state = cloneState(gameState);
    state.board[selected] = getPlayerColor(gameState.currentPlayer);

    const opponentColor = getPlayerColor(getOpponent(gameState.currentPlayer));

    const n = getDimensionFromLength(state.board.length);

    const grid = reshape(state.board, n);
    const r = Math.floor(selected / n);
    const c = selected % n;

    tryToCaptureAll(opponentColor, r, c, grid);
    const suicide = tryToCapture(grid[r][c], r, c, grid);

    state.board = grid.flat();

    if (suicide) {
      toast({
        title: "Invalid move",
        description: "That move would cause your own piece(s) to be captured!",
        status: "error",
        isClosable: true,
      });
    } else {
      const opponent = getOpponent(state.currentPlayer);
      state.currentPlayer = opponent;
      const currentMoves = [...moves, { player: gameState.currentPlayer, vertex: getVertexFromCoordinate(r, c) }];
      setMoves(currentMoves);
      setGameState(state);
      setSelected(null);

      generateMove(opponent, state, currentMoves);
    }
  };

  const passTurn = () => {
    const state = cloneState(gameState);
    if (state.consecutivePass) {
      state.running = false;
      setResult(calculateResult(state.board));
      openResultModal();
    } else {
      const opponent = getOpponent(state.currentPlayer);
      state.currentPlayer = opponent;
      state.consecutivePass = true;
      generateMove(opponent, state, moves);
    }

    setGameState(state);
  };

  let alertContent: string;
  let alertStatus: "success" | "warning" | "info";
  if (gameState.running) {
    if (gameState.currentPlayer === "BLACK") {
      alertContent = "Your turn";
      alertStatus = "success";
    } else {
      alertContent = "Waiting for KataGo";
      alertStatus = "warning";
    }
  } else {
    alertContent = "Game has ended";
    alertStatus = "info";
  }

  const isWaiting = !gameState.running || isLoading || gameState.currentPlayer !== "BLACK";

  return (
    <VStack gap="1vh">
      <Alert variant="left-accent" status={alertStatus}>
        <AlertIcon />
        {alertContent}
      </Alert>
      <SinglePlayerResultModal
        isOpen={isResultModalOpen}
        onClose={closeResultModal}
        playerPoints={result.blackPoints}
        opponentPoints={result.whitePoints}
      />
      <Game
        gameState={gameState}
        selected={selected}
        setSelected={setSelected}
        isWaiting={isWaiting}
        placeStone={placeStone}
        passTurn={passTurn}
        canEndGame={gameState.consecutivePass && !isWaiting}
      />
    </VStack>
  );
}

export { LocalSinglePlayerGame };
