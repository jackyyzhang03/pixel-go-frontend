import { Text } from "@chakra-ui/react";

import { ResultModal } from "./ResultModal";

type MultiplayerResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  blackPoints: number;
  whitePoints: number;
}

function MultiplayerResultModal(props: MultiplayerResultModalProps) {
  const {
    isOpen, onClose, blackPoints, whitePoints,
  } = props;

  let message;
  if (blackPoints > whitePoints) {
    message = "Black wins!";
  } else if (blackPoints < whitePoints) {
    message = "White wins!";
  } else {
    message = "Tie!";
  }

  return (
    <ResultModal message={message} isOpen={isOpen} onClose={onClose}>
      <Text>
        {`Area under black's control: ${blackPoints} ${blackPoints === 1 ? "square" : "squares"}.`}
      </Text>
      <Text>
        {`Area under white's control: ${whitePoints} ${blackPoints === 1 ? "square" : "squares"}.`}
      </Text>
    </ResultModal>
  );
}

export { MultiplayerResultModal };
