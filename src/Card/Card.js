import React, { useCallback, useLayoutEffect, useState } from "react";
import { Box, Button, Flex, Text, Input, Textarea } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import { CalendarIcon, SmallCloseIcon, TimeIcon } from "@chakra-ui/icons";

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
    setValue(event.target.value);
  };

  const handleIsEditable = (input) => {
    setIsEditable(!isEditable);
    if (input && value) {
      handleChange(column, task, value);
    }
  };

  const priorityColors = {
    low: "green.500",
    medium: "yellow.500",
    high: "red.500",
  };

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
          rounded="3px"
          p="1.5rem"
          justifyContent="flex-start"
          position="relative"
          gap="0.4rem"
          cursor="default"
        >
          <Flex justifyContent="space-between">
            <Box
              position="absolute"
              w="40px"
              h="10px"
              bg={priorityColors[task?.priority]}
              top="0"
              left="15px"
              cursor="pointer"
              borderRadius="0 0 4px 4px"
              onClick={() => handlePriority(task)}
            />
            {isEditable ? (
              <Textarea
                marginEnd="1rem"
                onBlur={() => handleIsEditable(true)}
                value={value}
                onChange={handleValue}
                size="md"
              />
            ) : (
              <Text
                backgroundColor="#2D374"
                cursor="pointer"
                marginEnd="1rem"
                onClick={() => handleIsEditable(false)}
                wordBreak="break-word"
                flexWrap="wrap"
              >
                {task?.content}
              </Text>
            )}

            <Box display="flex" justifySelf="flex-end" flexDir="row" gap="8px">
              <Button
                bg="delete-button"
                _focus={{ background: "#c71212d6" }}
                _hover={{ background: "#c71212d6" }}
                onClick={() => deleteTask(column, task.id)}
                position="absolute"
                w="2"
                h="5"
                top="0"
                right="0"
                borderRadius="0 4px 0  4px"
              >
                <SmallCloseIcon />
              </Button>
            </Box>
          </Flex>
          <Flex gap="0.5rem" alignItems="center">
            <Flex
              fontWeight="bold"
              fontSize="0.7rem"
              gap="0.3rem"
              color="subtle-text"
              alignItems="center"
            >
              <CalendarIcon />
              <Text>
                {new Date(task?.creationDate).getDate()} /{" "}
                {`${new Date(task?.creationDate).getMonth() + 1}`.padStart(
                  2,
                  0
                )}{" "}
                / {`${new Date(task?.creationDate).getFullYear()}`.slice(-2)}{" "}
              </Text>
            </Flex>
            <Flex
              fontWeight="bold"
              fontSize="0.7rem"
              color="subtle-text"
              gap="0.3rem"
              alignItems="center"
            >
              <TimeIcon />
              <Text>
                {new Date(task?.creationDate).getHours()}:
                {`${new Date(task?.creationDate).getMinutes()}`.padStart(2, 0)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Draggable>
  );
};

export default Card;
