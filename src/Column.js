import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Card from "./Card/Card";
export default function Column({
  column,
  tasks,
  addTask,
  deleteTask,
  handleChange,
}) {
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
              <Card
                handleChange={handleChange}
                deleteTask={deleteTask}
                task={task}
                index={index}
                key={index}
                column={column.id}
              />
            ))}
            {droppableProvided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  );
}
