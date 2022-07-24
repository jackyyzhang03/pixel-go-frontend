import {
  Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type ResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  children: ReactNode;
}

function ResultModal(props: ResultModalProps) {
  const {
    isOpen, onClose, message, children,
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{message}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {children}
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button as={Link} to="/">Back to home</Button>
            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { ResultModal };
