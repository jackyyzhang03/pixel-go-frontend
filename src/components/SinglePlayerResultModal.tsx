import { Text } from "@chakra-ui/react";

import { ResultModal } from "./ResultModal";

type SinglePlayerResultModalProps = {
    isOpen: boolean;
    onClose: () => void;
    playerPoints: number;
    opponentPoints: number;
}

function SinglePlayerResultModal(props: SinglePlayerResultModalProps) {
  const {
    playerPoints, opponentPoints, isOpen, onClose,
  } = props;

  let message;
  if (playerPoints > opponentPoints) {
    message = "You won!";
  } else if (playerPoints < opponentPoints) {
    message = "You lost!";
  } else {
    message = "Tie!";
  }

  return (
    <ResultModal message={message} isOpen={isOpen} onClose={onClose}>
      <Text>
        {`Area under your control: ${playerPoints} ${playerPoints === 1 ? "square" : "squares"}.`}
      </Text>
      <Text>
        {`Area under opponent's control: ${opponentPoints} ${opponentPoints === 1 ? "square" : "squares"}.`}
      </Text>
    </ResultModal>
  );
}

export { SinglePlayerResultModal };
