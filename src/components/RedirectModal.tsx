import {
  Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

type RedirectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    content: string
}

function RedirectAlert(props: RedirectModalProps) {
  const { isOpen, onClose, content } = props;
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{content}</ModalHeader>
        <ModalBody pb={6}>
          <Text>Click the button below to return to the home page.</Text>
        </ModalBody>
        <ModalFooter>
          <Button as={Link} to="/">Back to home</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { RedirectAlert };
