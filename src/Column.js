import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

export default function Column({ column, tasks, addTask }) {
  return (
    <Flex rounded="3px" bg="column-bg" w="400px" minH="620px" flexDir="column">
      <Flex
        alignItems="center"
        h="60px"
        bg="column-header-bg"
        rounded="3px 3px 0 0"
        px="1.5rem"
        mb="1.5rem"
        justifyContent="space-between"
      >
        <Text fontSize="17px" fontWeight={600} color="subtle-text">
          {column.title}
        </Text>

        <Button
          onClick={() => addTask(column.id)}
          bg="card-bg"
          w="32px"
          h="32px"
          colorScheme="card-darker-bg"
        >
          +
        </Button>
      </Flex>
      <Droppable droppableId={column.id}>
        {(droppableProvided, snapshot) => (
          <Flex
            px="1.5rem"
            flex={1}
            flexDir="column"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks?.map((task, index) => (
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
                    <Text maxW="60%" flexWrap="wrap">
                      {task.content}
                    </Text>
                    <Box
                      display="flex"
                      justifySelf="flex-end"
                      alignSelf="center"
                      flexDir="row"
                      gap="8px"
                    >
                      <Button
                        bg="edit-button"
                        _hover={{ background: "#1551d2d6" }}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        bg="delete-button"
                        _hover={{ background: "#c71212d6" }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  </Flex>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  );
}
