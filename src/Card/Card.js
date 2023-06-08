import React, { useLayoutEffect } from "react";
import { Box, Button, Flex, Text, Input } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import { DeleteIcon } from "@chakra-ui/icons";

const Card = ({ task, index, handleChange, column, deleteTask }) => {
  const [isEditable, setIsEditable] = React.useState(false);
  const [value, setValue] = React.useState("");

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
      handleChange(column, value, task.id);
    }
  };

  return (
    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
      {(draggableProvider, snapshot) => (
        <Flex
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
        >
          <Box
            position="absolute"
            w="40px"
            h="8px"
            bg="green"
            top="0"
            left="15px"
            borderRadius="0 0 4px 4px"
          />
          {isEditable ? (
            <Input
              onBlur={() => handleIsEditable(true)}
              value={value}
              onChange={handleValue}
            />
          ) : (
            <Text
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
              _hover={{ background: "#c71212d6" }}
              onClick={() => deleteTask(column, task.id)}
            >
              <DeleteIcon />
            </Button>
          </Box>
        </Flex>
      )}
    </Draggable>
  );
};

export default Card;
