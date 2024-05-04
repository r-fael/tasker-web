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
import styles from "./Modal.module.scss";
import { priorityColors } from "../../../pages";
import Markdown from "../Markdown/Markdown";

const DisplayText = ({
  showErrors,
  title,
  handleValue,
  isEditable,
  handleIsEditable,
}) => {
  return (
    <>
      {isEditable ? (
        <Textarea
          isInvalid={showErrors && title.trim() === ""}
          marginEnd="1rem"
          value={title}
          onBlur={(e) => handleIsEditable(e, false)}
          onChange={handleValue}
          size="md"
          autoFocus
        />
      ) : (
        <Markdown onclick={(e) => handleIsEditable(e, true)} content={title} />
      )}
    </>
  );
};

const TaskModal = ({ isOpen, onClose, handleSubmit }) => {
  const [title, setTitle] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [priority, setPriority] = useState("low");
  const [isEditable, setIsEditable] = useState(true);

  const handleValue = (event) => {
    let { value } = event.target;
    setTitle(value);
  };

  const handleIsEditable = (e, state) => {
    if (e.target.value) {
      setTitle(e.target.value);
      setIsEditable(state);
    }
    if (state === true) {
      setIsEditable(state);
    }
  };

  const isValid = () => {
    const error = title?.trim() === "";
    setShowErrors(error);
    return !error;
  };

  const handleOnClose = () => {
    setTitle("");
    setPriority("low");
    setIsEditable(true);
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
          <DisplayText
            showErrors={showErrors}
            title={title}
            handleValue={handleValue}
            isEditable={isEditable}
            handleIsEditable={handleIsEditable}
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
              if (isValid()) {
                handleOnClose();
                handleSubmit(title, priority);
              }
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
