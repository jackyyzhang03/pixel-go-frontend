import {
  Box, Button, Fade, Heading, useDisclosure, useOutsideClick,
  VStack, Wrap,
} from "@chakra-ui/react";
import {
  ChangeEvent, useCallback, useRef, useState,
} from "react";
import { Link } from "react-router-dom";

import { ButtonCard } from "../components/ButtonCard";
import { JoinInput } from "../components/JoinInput";

function HomePage() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [gameId, setGameId] = useState("");
  const ref = useRef(null);

  useOutsideClick({
    ref,
    handler: () => { if (!gameId) onClose(); },
  });

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setGameId((e.target as HTMLInputElement).value);
  }, []);

  return (
    <VStack gap="40px">
      <Heading size="3xl">PixelGo</Heading>
      <Wrap spacing="40px" justify="center">
        <ButtonCard heading="Local play">
          <Button as={Link} to="/game/engine">Play against the computer</Button>
          <Button as={Link} to="/game/local">Take turns</Button>
        </ButtonCard>
        <ButtonCard heading="Online multiplayer">
          <Button as={Link} to="/game/new">Create a new game</Button>
          <Button onClick={onOpen}>Join an existing game</Button>
        </ButtonCard>
      </Wrap>
      <Box width="100%">
        <Fade in={isOpen}>
          <Box ref={ref} p="20px" borderWidth="1px" borderRadius={10} gap="10px">
            <JoinInput onChange={onChange} gameId={gameId} />
          </Box>
        </Fade>
      </Box>
    </VStack>
  );
}

export { HomePage };
