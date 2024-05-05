import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  Text,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import Markdown from "../Markdown/Markdown";
import { CalendarIcon, DeleteIcon, TimeIcon } from "@chakra-ui/icons";
import styles from "./Card.module.scss";

const DateText = ({ date }) => {
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = `${date.getFullYear()}`.slice(-2);
  const dateToDisplay = `${day} / ${month} / ${year}`;
  return <Text>{dateToDisplay}</Text>;
};

const TimeText = ({ date }) => {
  const hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, 0);
  const timeToDisplay = `${hours}:${minutes}`;
  return <Text>{timeToDisplay}</Text>;
};

const DateTime = ({ dateTime }) => {
  return (
    <Flex gap="0.5rem" alignItems="center">
      <Flex
        fontWeight="bold"
        fontSize="0.7rem"
        gap="0.3rem"
        color="subtle-text"
        alignItems="center"
      >
        <CalendarIcon />
        <DateText date={dateTime} />
      </Flex>

      <Flex
        fontWeight="bold"
        fontSize="0.7rem"
        color="subtle-text"
        gap="0.3rem"
        alignItems="center"
      >
        <TimeIcon />
        <TimeText date={dateTime} />
      </Flex>
    </Flex>
  );
};

const DisplayText = ({
  isEditable,
  handleIsEditable,
  task,
  handleValue,
  value,
}) => {
  return (
    <>
      {isEditable ? (
        <Textarea
          onBlur={() => handleIsEditable(true)}
          onChange={handleValue}
          marginEnd="1rem"
          value={value}
          size="md"
          autoFocus
        />
      ) : (
        <Markdown
          onclick={() => handleIsEditable(false)}
          content={task?.content}
        />
      )}
    </>
  );
};

export const priorityColors = {
  low: "green.500",
  medium: "yellow.500",
  high: "red.500",
};

const PriorityBox = ({ handlePriority, task }) => {
  return (
    <Box
      className={styles.priorityBox}
      bg={priorityColors[task?.priority]}
      onClick={() => handlePriority(task)}
    />
  );
};

const MenuContainer = ({ isOpen, setIsOpen, deleteTask, task, column }) => {
  const [goToConfirm, setGoToConfirm] = useState(false);

  const handleClick = () => {
    if (!goToConfirm) {
      setGoToConfirm(true);
    } else {
      deleteTask(column, task.id);
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) setGoToConfirm(false);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Menu
      isOpen={isOpen}
      onBlur={() => handleClose()}
      closeOnSelect={false}
      onClose={() => handleClose()}
    >
      <MenuList>
        <MenuItem onClick={handleClick}>
          <Button>
            {goToConfirm ? (
              "Confirm?"
            ) : (
              <>
                <DeleteIcon fontSize="small" /> Delete Task
              </>
            )}
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const Card = ({
  task,
  index,
  handleChange,
  column,
  deleteTask,
  handlePriority,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef();

  useLayoutEffect(() => {
    setValue(task.content);
    setIsEditable(false);
  }, [task]);

  const handleValue = (event) => {
    let { value } = event.target;
    if (value.trim !== "") setValue(value);
  };

  const handleIsEditable = (input) => {
    setIsEditable(!isEditable);
    if (input && value) {
      handleChange(column, task, value);
    }
  };

  const creationDate = new Date(task?.creationDate);

  useEffect(() => {
    const event = cardRef.current.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (event.button == 2) {
        setIsMenuOpen(true);
      }
    });

    return () => cardRef.current?.removeEventListener("contextmenu", event);
  }, []);

  return (
    <Box ref={cardRef} className={styles.cardBox}>
      <MenuContainer
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        deleteTask={deleteTask}
        task={task}
        column={column}
      />
      <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
        {(draggableProvider, snapshot) => (
          <Flex
            ref={draggableProvider.innerRef}
            {...draggableProvider.draggableProps}
            {...draggableProvider.dragHandleProps}
            className={styles.cardContainer}
          >
            <Flex justifyContent="space-between">
              <PriorityBox handlePriority={handlePriority} task={task} />
              <DisplayText
                handleValue={handleValue}
                handleIsEditable={handleIsEditable}
                isEditable={isEditable}
                task={task}
                value={value}
              />
            </Flex>

            <DateTime dateTime={creationDate} />
          </Flex>
        )}
      </Draggable>
    </Box>
  );
};

export default Card;
