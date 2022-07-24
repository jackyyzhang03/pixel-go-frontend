import { GridItem, useStyleConfig } from "@chakra-ui/react";

type BoardSquareProps = {
  variant: string;
  onClick: () => void;
}

function BoardSquare(props: BoardSquareProps) {
  const { variant, onClick } = props;
  const styles = useStyleConfig("BoardSquare", { variant });
  return <GridItem __css={styles} onClick={onClick} />;
}

export { BoardSquare };
