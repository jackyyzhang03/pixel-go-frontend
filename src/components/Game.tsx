import {
  Button, HStack, VStack,
} from "@chakra-ui/react";

import { Board, EMPTY } from "./Board";

type Player = "BLACK" | "WHITE";

type GameState = {
  board: string[];
  moveNumber: number;
  currentPlayer: Player;
  numPlayers: number;
  running: boolean;
  consecutivePass: boolean;
}

type GameResult = {
  blackPoints: number;
  whitePoints: number;
}

const defaultGameState = {
  board: Array(19 * 19).fill(EMPTY),
  moveNumber: 0,
  currentPlayer: "BLACK",
  numPlayers: 1,
  running: false,
  consecutivePass: false,
};

type GameProps = {
  gameState: GameState;
  selected: number | null;
  // eslint-disable-next-line no-unused-vars
  setSelected: (i: number | null) => void;
  isWaiting: boolean;
  placeStone: () => void;
  passTurn: () => void;
  canEndGame: boolean;
}

function Game(props: GameProps) {
  const {
    gameState, selected, setSelected, isWaiting, placeStone, passTurn, canEndGame,
  } = props;

  return (
    <VStack gap="1vh">
      <Board
        size={19}
        state={gameState.board}
        selected={selected}
        setSelected={(i: number | null) => { setSelected(i); }}
      />
      <HStack>
        <Button disabled={selected === null || isWaiting} onClick={placeStone}>Place Square</Button>
        <Button disabled={isWaiting} onClick={passTurn}>{canEndGame ? "End game" : "Pass"}</Button>
      </HStack>
    </VStack>
  );
}

export {
  defaultGameState, Game,
};

export type { GameResult, GameState, Player };
