import {
  Button, FormControl, FormErrorMessage, HStack, Input,
} from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

type JoinInputProps = {
    gameId: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function JoinInput(props: JoinInputProps) {
  const { gameId, onChange } = props;
  const regexExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  const isUUID = regexExp.test(gameId);
  return (
    <FormControl isInvalid={!isUUID && gameId !== ""}>
      <HStack>
        <Input onChange={onChange} placeholder="Game ID" />
        {isUUID
          ? <Button as={Link} to={`/game/join/${gameId}`}>Join Game</Button>
          : <Button disabled>Join Game</Button>}
      </HStack>
      <FormErrorMessage>Invalid Game ID.</FormErrorMessage>
    </FormControl>
  );
}

export { JoinInput };
