import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Textarea,
  Box,
} from "@chakra-ui/react";
import { handleText } from "../../utils";
import styles from "./Modal.module.scss";
import { priorityColors } from "../../../pages";

const TaskModal = ({ isOpen, onClose, handleSubmit }) => {
  const [title, setTitle] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [priority, setPriority] = useState("low");

  const isValid = () => {
    const error = title?.trim() === "";
    setShowErrors(error);
    return !error;
  };

  const handleValue = (event) => {
    let { value } = event.target;
    value = handleText(value);
    setTitle(value);
  };

  const handleOnClose = () => {
    setTitle("");
    setShowErrors(false);
    onClose();
  };

  const handleChangePriority = () => {
    switch (priority) {
      case "low":
        setPriority("medium");
        break;
      case "medium":
        setPriority("high");
        break;
      case "high":
        setPriority("low");
        break;
    }
  };

  const PriorityBox = ({ priority }) => {
    return (
      <Box
        className={styles.priorityBox}
        bg={priorityColors[priority]}
        onClick={() => handleChangePriority()}
      />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent bg="column-header-bg" fontWeight={600} color="subtle-text">
        <ModalHeader className={styles.titleContainer}>
          <Text>Create Task</Text>
          <PriorityBox priority={priority} />
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Textarea
            isInvalid={showErrors && title.trim() === ""}
            resize="none"
            marginEnd="1rem"
            value={title}
            onChange={handleValue}
            size="md"
            autoFocus
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            color="#424242"
            mr={3}
            onClick={handleOnClose}
            _focus={{ background: "column-header-bg" }}
            _hover={{ background: "column-header-bg" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setTitle("");
              if (isValid()) handleSubmit(title, priority);
            }}
            colorScheme="blue"
          >
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
