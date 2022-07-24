import { Grid } from "@chakra-ui/react";
import { useCallback } from "react";

import { BoardSquare } from "./BoardSquare";

const EMPTY = " ";
const BLACK = "B";
const WHITE = "W";

type Color = " " | "B" | "W";

type BoardProps = {
    state: string[];
    size: number;
    selected: number | null;
    // eslint-disable-next-line no-unused-vars
    setSelected: (i: number | null) => void;
}

function getVariant(n: string) {
  if (n === BLACK) return "black";
  if (n === WHITE) return "white";
  return "empty";
}

function Board(props: BoardProps) {
  const {
    state, size, selected, setSelected,
  } = props;

  const onClick = useCallback((i: number) => {
    if (state[i] === EMPTY) {
      setSelected(i);
    } else {
      setSelected(null);
    }
  }, [state, setSelected]);

  return (
    <Grid templateColumns={`repeat(${size}, 1fr)`} gap="1px">
      {state.map((color: string, i: number) => (
        <BoardSquare onClick={() => onClick(i)} key={i} variant={selected === i ? "selected" : getVariant(color)} />
      ))}
    </Grid>
  );
}

export {
  BLACK, Board, EMPTY, WHITE,
};

export type { Color };
