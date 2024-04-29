import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";
import Card from "../Card/Card";

const ColumnHeader = ({ handleOpenModal, column, tasksToShow }) => {
  return (
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
        {column.title} ({tasksToShow.length})
      </Text>

      {column?.id !== "column-3" && (
        <Button
          onClick={() => handleOpenModal(column.id)}
          bg="card-bg"
          w="32px"
          h="32px"
          colorScheme="card-darker-bg"
        >
          +
        </Button>
      )}
    </Flex>
  );
};

const ColumnContent = ({
  column,
  handleChange,
  handlePriority,
  tasksToShow,
  deleteTask,
}) => {
  return (
    <Droppable droppableId={column.id}>
      {(droppableProvided, snapshot) => (
        <Flex
          px="1.5rem"
          flex={1}
          flexDir="column"
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
        >
          {tasksToShow.map((task, index) => (
            <Card
              handlePriority={handlePriority}
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
  );
};

export default function Column({
  column,
  tasks,
  handleOpenModal,
  deleteTask,
  handleChange,
  handlePriority,
  priorityFilter,
}) {
  const tasksToShow = tasks?.filter((task) => {
    if (priorityFilter != "none") return task.priority === priorityFilter;
    else return task;
  });
  return (
    <Flex rounded="3px" bg="column-bg" w="400px" minH="620px" flexDir="column">
      <ColumnHeader
        handleOpenModal={handleOpenModal}
        column={column}
        tasksToShow={tasksToShow}
      />

      <ColumnContent
        column={column}
        deleteTask={deleteTask}
        handleChange={handleChange}
        handlePriority={handlePriority}
        tasksToShow={tasksToShow}
      />
    </Flex>
  );
}
