import React, { useLayoutEffect, useState } from "react";
import { Box, Button, Flex, Text, Input, Textarea } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import { DeleteIcon } from "@chakra-ui/icons";

const Card = ({ task, index, handleChange, column, deleteTask }) => {
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
      task.new = false;
      handleChange(column, value, task.id, task.creationDate);
    }
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
          justifyContent="space-between"
          position="relative"
          gap="0.4rem"
        >
          <Flex justifyContent="space-between">
            <Box
              position="absolute"
              w="40px"
              h="8px"
              bg="green"
              top="0"
              left="15px"
              borderRadius="0 0 4px 4px"
            />
            {isEditable || task?.new ? (
              <Textarea
                onBlur={() => handleIsEditable(true)}
                value={value}
                onChange={handleValue}
              />
            ) : (
              <Text
                backgroundColor="#2D374"
                onClick={() => handleIsEditable(false)}
                maxW="60%"
                flexWrap="wrap"
              >
                {task?.content}
              </Text>
            )}

            <Box
              display="flex"
              justifySelf="flex-end"
              alignSelf="center"
              flexDir="row"
              gap="8px"
            >
              <Button
                bg="delete-button"
                _focus={{ background: "#c71212d6" }}
                _hover={{ background: "#c71212d6" }}
                onClick={() => deleteTask(column, task.id)}
              >
                <DeleteIcon />
              </Button>
            </Box>
          </Flex>
          <Flex>
            <Text fontWeight="bold" fontSize="0.8rem">
              {console.log(typeof task?.creationDate)}
              {new Date(task?.creationDate).getDate()} /{" "}
              {`${new Date(task?.creationDate).getMonth()}`.padStart(2, 0)} /{" "}
              {new Date(task?.creationDate).getFullYear()}
            </Text>
          </Flex>
        </Flex>
      )}
    </Draggable>
  );
};

export default Card;
