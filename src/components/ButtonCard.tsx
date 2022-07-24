import { Heading, HStack, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

type ButtonCardProps = {
  heading: string;
  children?: ReactNode;
}

function ButtonCard(props: ButtonCardProps) {
  const { heading, children } = props;
  return (
    <VStack p="20px" borderWidth="1px" borderRadius={10} gap="10px">
      <Heading size="lg">{heading}</Heading>
      <HStack>
        {children}
      </HStack>
    </VStack>
  );
}

export { ButtonCard };
