import { ChakraProvider, Flex, VStack } from "@chakra-ui/react";
import { Client } from "@stomp/stompjs";
import { Navigate, Route, Routes } from "react-router-dom";

import { GamePage } from "../pages/GamePage";
import { HomePage } from "../pages/HomePage";
import { theme } from "../theme";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const client = new Client({ brokerURL: `ws://${process.env.REACT_APP_SERVER_ADDRESS}/ws` });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <VStack textAlign="center" fontSize="xl" minHeight="100vh">
        <Flex direction="row-reverse" w="100%">
          <ColorModeSwitcher />
        </Flex>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/new" element={<GamePage multiplayer />} />
          <Route path="/game/join/:id" element={<GamePage multiplayer />} />
          <Route path="/game/local" element={<GamePage local multiplayer />} />
          <Route path="/game/engine" element={<GamePage local />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </VStack>
    </ChakraProvider>
  );
}

export { App, client };
