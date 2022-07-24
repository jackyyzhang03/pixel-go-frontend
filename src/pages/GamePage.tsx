import { Heading, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { LocalMultiplayerGame } from "../components/LocalMultiplayerGame";
import { LocalSinglePlayerGame } from "../components/LocalSinglePlayerGame";
import { WebMultiplayerGame } from "../components/WebMultiplayerGame";

type GamePageProps = {
  local?: boolean | true;
  multiplayer?: boolean | true;
}

function GamePage(props: GamePageProps) {
  const { local, multiplayer } = props;

  let game;
  if (local && multiplayer) {
    game = <LocalMultiplayerGame />;
  } else if (local) {
    game = <LocalSinglePlayerGame />;
  } else {
    game = <WebMultiplayerGame />;
  }

  return (
    <VStack gap={2}>
      <Link to="/">
        <Heading size="xl">PixelGo</Heading>
      </Link>
      {game}
    </VStack>
  );
}

export { GamePage };
