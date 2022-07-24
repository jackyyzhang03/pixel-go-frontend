import {
  Alert, AlertIcon, Skeleton, Text, Tooltip, useClipboard, useDisclosure, useToast, VStack,
} from "@chakra-ui/react";
import { Frame } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getVertexFromCoordinate } from "../game-utils";
import { client } from "./App";
import {
  defaultGameState, Game, GameResult, GameState, Player,
} from "./Game";
import { RedirectAlert } from "./RedirectModal";
import { SinglePlayerResultModal } from "./SinglePlayerResultModal";

type ErrorResponse = {
    name: string;
    message: string;
}

type NewGameResponse = {
    gameId: string;
    player: Player;
}

function WebMultiplayerGame() {
  const [player, setPlayer] = useState("BLACK" as Player);
  const [gameId, setGameId] = useState("");
  const [gameState, setGameState] = useState(defaultGameState as GameState);
  const [selected, setSelected] = useState(null as number | null);
  const [result, setResult] = useState({} as GameResult);
  const [errorMessage, setErrorMessage] = useState("");

  const toast = useToast();
  const { id } = useParams();
  const { hasCopied, onCopy } = useClipboard(gameId);
  const { isOpen: isResultModalOpen, onOpen: openResultModal, onClose: closeResultModal } = useDisclosure();
  const { isOpen: isErrorModalOpen, onOpen: openErrorModal, onClose: closeErrorModal } = useDisclosure();

  const toastError = useCallback((name: string, message: string) => {
    let title = name;
    let description = message;

    if (title === "InvalidMoveException") {
      title = "Invalid move";
      switch (description) {
        case "SUICIDE":
          description = "That move would cause your own stone(s) to be captured!";
          break;
        case "OCCUPIED_POSITION":
          description = "There is already a stone located here.";
          break;
        case "REPEATED_POSITION":
          description = "That move would cause a repetition of a previous position.";
          break;
        default:
          description = "That is an invalid move";
          break;
      }
    }

    toast({
      title,
      description,
      status: "error",
      isClosable: true,
    });
  }, []);

  useEffect(() => {
    client.onWebSocketError = () => {
      toastError("Websocket error", "Attempting to reconnect...");
    };
    client.onConnect = () => {
      client.subscribe("/user/queue/errors", (frame: Frame) => {
        const error = JSON.parse(frame.body) as ErrorResponse;
        switch (error.name) {
          case "GameNotFoundException":
            setErrorMessage("This game does not exist.");
            openErrorModal();
            break;
          case "GameFullException":
            setErrorMessage("This game is already full.");
            openErrorModal();
            break;
          default:
            toastError(error.name, error.message);
        }
      });

      const gameUrl = id ? `/app/join/${id}` : "/app/create";
      client.subscribe(gameUrl, (frame: Frame) => {
        const response = JSON.parse(frame.body) as NewGameResponse;
        setGameId(response.gameId);
        setPlayer(response.player);

        // Recieve game states updates
        // eslint-disable-next-line no-shadow
        client.subscribe(`/topic/state/${response.gameId}`, (frame: Frame) => {
          const state = JSON.parse(frame.body) as GameState;
          state.board = state.board.flatMap((row) => row.split("")); // Character array is serialized as a string
          setGameState(state);
        });

        // Recieve game results
        // eslint-disable-next-line no-shadow
        client.subscribe(`/topic/result/${response.gameId}`, (frame: Frame) => {
          const body = JSON.parse(frame.body) as GameResult;
          setResult(body);
          openResultModal();
        });

        // Send ready status when done subscribing
        client.publish({
          destination: `/app/ready/${response.gameId}`,
        });
      });
    };

    client.activate();

    return () => { client.deactivate(); };
  }, []);

  const sendMove = useCallback((vertex: string) => {
    client.publish({
      destination: "/app/move",
      body: JSON.stringify({
        moveNumber: gameState.moveNumber,
        vertex,
      }),
    });
  }, [gameState]);

  const placeStone = useCallback(() => {
    if (selected === null) return;

    const r = Math.floor(selected / 19);
    const c = selected % 19;

    sendMove(getVertexFromCoordinate(r, c));
    setSelected(null);
  }, [sendMove, selected]);

  const passTurn = useCallback(() => {
    sendMove("PASS");
    setSelected(null);
  }, [sendMove]);

  const isWaiting = gameState.currentPlayer !== player || !gameState.running;
  const isPlayersTurn = gameState.currentPlayer === player;
  const playerPoints = player === "BLACK" ? result.blackPoints : result.whitePoints;
  const opponentPoints = player === "BLACK" ? result.whitePoints : result.blackPoints;
  const canEndGame = gameState.consecutivePass && (isPlayersTurn || !gameState.running);

  let alertStatus: "success" | "warning" | "info";
  if (gameState.running) {
    if (isPlayersTurn) {
      alertStatus = "success";
    } else {
      alertStatus = "warning";
    }
  } else {
    alertStatus = "info";
  }

  let alertContent: string;
  if (!gameId) {
    alertContent = "Waiting to obtain a game";
  } else if (gameState.numPlayers === 2) {
    if (gameState.running) {
      if (isPlayersTurn) {
        alertContent = "Your turn";
      } else {
        alertContent = "Opponent's turn";
      }
    } else {
      alertContent = "The game has ended";
    }
  } else {
    alertContent = "Waiting for opponent to join";
  }

  return (
    <VStack gap="1vh">
      <Skeleton width="500px" isLoaded={!!gameId}>
        <Tooltip closeOnClick={false} label={hasCopied ? "Copied" : "Click to copy"} hasArrow>
          <Text cursor="pointer" onClick={onCopy}>
            {`Game ID: ${gameId}`}
          </Text>
        </Tooltip>
      </Skeleton>
      <Alert variant="left-accent" status={alertStatus}>
        <AlertIcon />
        {alertContent}
      </Alert>

      <RedirectAlert isOpen={isErrorModalOpen} onClose={closeErrorModal} content={errorMessage} />

      <SinglePlayerResultModal
        isOpen={isResultModalOpen}
        onClose={closeResultModal}
        playerPoints={playerPoints}
        opponentPoints={opponentPoints}
      />
      <Game
        gameState={gameState}
        selected={selected}
        isWaiting={isWaiting}
        setSelected={(i) => { if (!isWaiting) setSelected(i); }}
        placeStone={placeStone}
        passTurn={passTurn}
        canEndGame={canEndGame}
      />

    </VStack>
  );
}

export { WebMultiplayerGame };
