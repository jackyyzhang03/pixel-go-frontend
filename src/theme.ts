import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { GlobalProps } from "@emotion/react";

type ColorModeOptions = {
    colorMode: "light" | "dark";
}

const BoardSquare = {
  baseStyle: {
    height: "1.6vw",
    width: "1.6vw",
    minWidth: "25px",
    minHeight: "25px",
  },
  variants: {
    empty: ({ colorMode }: ColorModeOptions) => ({
      bg: colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.300",
    }),
    black: ({ colorMode }: ColorModeOptions) => ({
      bg: colorMode === "dark" ? "blue.500" : "blackAlpha.700",
    }),
    white: ({ colorMode }: ColorModeOptions) => ({
      bg: colorMode === "dark" ? "whiteAlpha.900" : "red.500",
    }),
    selected: ({ colorMode }: ColorModeOptions) => ({
      border: colorMode === "dark" ? "1px solid white" : "1px solid grey",
    }),

  },
  // The default variant value
  defaultProps: {
    variant: "empty",
  },
};

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  styles: {
    global: (props: GlobalProps) => ({
      body: {
        bg: mode("white", "gray.900")(props),
      },
    }),
  },
  components: {
    BoardSquare,
  },
});

export { theme };
