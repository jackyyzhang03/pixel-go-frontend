import {
  Alert, AlertIcon, useDisclosure, useToast, VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import {
  calculateResult, cloneState, getDimensionFromLength, getOpponent,
  getPlayerColor, reshape, tryToCapture, tryToCaptureAll,
} from "../game-utils";
import {
  EMPTY,
} from "./Board";
import {
  defaultGameState, Game, GameResult, GameState,
} from "./Game";
import { MultiplayerResultModal } from "./MultiplayerResultModal";

function LocalMultiplayerGame() {
  const [gameState, setGameState] = useState({ ...defaultGameState, running: true } as GameState);
  const [selected, setSelected] = useState(null as number | null);
  const [result, setResult] = useState({} as GameResult);

  const toast = useToast();
  const { isOpen: isResultModalOpen, onOpen: openResultModal, onClose: closeResultModal } = useDisclosure();

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
      state.currentPlayer = getOpponent(state.currentPlayer);
      setGameState(state);
      setSelected(null);
    }
  };

  const passTurn = () => {
    const state = cloneState(gameState);

    if (state.consecutivePass) {
      state.running = false;
      setResult(calculateResult(state.board));
      openResultModal();
    } else {
      state.currentPlayer = getOpponent(state.currentPlayer);
      state.consecutivePass = true;
    }

    setGameState(state);
  };

  let alertContent;
  if (gameState.running) {
    if (gameState.currentPlayer === "BLACK") {
      alertContent = "Black's turn";
    } else {
      alertContent = "White's turn";
    }
  } else {
    alertContent = "The game has ended";
  }

  return (
    <VStack gap="1vh">
      <Alert variant="left-accent" status="info">
        <AlertIcon />
        {alertContent}
      </Alert>
      <MultiplayerResultModal
        isOpen={isResultModalOpen}
        onClose={closeResultModal}
        blackPoints={result.blackPoints}
        whitePoints={result.whitePoints}
      />
      <Game
        gameState={gameState}
        selected={selected}
        setSelected={setSelected}
        isWaiting={!gameState.running}
        placeStone={placeStone}
        passTurn={passTurn}
        canEndGame={gameState.consecutivePass}
      />
    </VStack>
  );
}

export { LocalMultiplayerGame };
