import React, { useLayoutEffect, useState } from "react";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import Markdown from "../Markdown/Markdown";
import { CalendarIcon, SmallCloseIcon, TimeIcon } from "@chakra-ui/icons";
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

const DeleteButton = ({ column, task, deleteTask }) => {
  return (
    <Box display="flex" justifySelf="flex-end" flexDir="row" gap="8px">
      <Box
        className={styles.deleteButton}
        onClick={() => deleteTask(column, task.id)}
      >
        <SmallCloseIcon color="white" />
      </Box>
    </Box>
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

  return (
    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
      {(draggableProvider, snapshot) => (
        <Flex
          flexDirection="column"
          ref={draggableProvider.innerRef}
          {...draggableProvider.draggableProps}
          {...draggableProvider.dragHandleProps}
          mb="1rem"
          w="100%"
          minH="72px"
          bg="card-bg"
          rounded="0.5rem"
          p="1.5rem"
          justifyContent="flex-start"
          position="relative"
          gap="1rem"
          cursor="default"
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

            <DeleteButton deleteTask={deleteTask} task={task} column={column} />
          </Flex>

          <DateTime dateTime={creationDate} />
        </Flex>
      )}
    </Draggable>
  );
};

export default Card;
