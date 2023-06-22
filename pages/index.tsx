import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Flex, Heading, Text } from "@chakra-ui/react";
const Column = dynamic(() => import("../src/Column"), { ssr: false });
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RepeatIcon } from "@chakra-ui/icons";

export default function Home() {
  const [state, setState] = useState({} as IInitialData);
  const [tasksCount, setTasksCount] = useState<number>(0);
  const reorderColumnsList = (sourceColumn, startIndex, endIndex) => {
    const newTasksIds = Array.from(sourceColumn.taskIds);
    const [item] = newTasksIds.splice(startIndex, 1);
    newTasksIds.splice(endIndex, 0, item);
    const newColumn = {
      ...sourceColumn,
      taskIds: newTasksIds,
    };

    return newColumn;
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    //if drag to an unknown place
    if (!destination || !source) return;
    //if drag in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const sourceColumn = state.columns[source.droppableId];
    const destinationColumn = state.columns[destination.droppableId];
    if (sourceColumn.id == destinationColumn.id) {
      const newColumn = reorderColumnsList(
        sourceColumn,
        source.index,
        destination.index
      );
      const newState = {
        ...state,
        columns: { ...state.columns, [newColumn.id]: newColumn },
      };
      setState(newState);
      return;
    }

    //if drag from different column

    const startTaskIds = Array.from(sourceColumn.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartColumns = {
      ...sourceColumn,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationColumn.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndColumns = {
      ...destinationColumn,
      taskIds: endTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartColumns.id]: newStartColumns,
        [newEndColumns.id]: newEndColumns,
      },
    };
    setState(newState);
  };

  const handleChange = (column, value, index, date) => {
    const newState = { ...state };
    newState.tasks = {
      ...newState.tasks,
      [index]: { id: index, content: value, creationDate: date },
    };

    setState(newState);
  };

  const handleResetCount = () => {
    setTasksCount(0);
    localStorage.setItem("tasksCount", "0");
  };

  const addTask = (title) => {
    const newState = { ...state };
    const id = Object.keys(newState.tasks).length + 1;
    newState.tasks = {
      ...newState.tasks,
      [id]: {
        id: id,
        content: "Empty Task",
        new: true,
        creationDate: new Date(),
      },
    };
    newState.columns[title].taskIds = [id, ...newState.columns[title].taskIds];
    setState(newState);
  };

  const deleteTask = (column, index) => {
    const newState = { ...state };
    delete newState.tasks[index];
    newState.columns[column].taskIds = newState.columns[column].taskIds.filter(
      (id) => id != index
    );
    toast.success("Task deleted successfully!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setTasksCount((prev) => prev + 1);
    localStorage.setItem("tasksCount", `${tasksCount + 1}`);
    setState(newState);
  };

  useEffect(() => {
    //if state changes

    if (Object.keys(state).length > 0)
      localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    //init state
    const stateParsed = JSON.parse(localStorage.getItem("state"));
    const tasksCount = Number(localStorage.getItem("tasksCount"));
    console.log(tasksCount);
    if (tasksCount !== null) setTasksCount(tasksCount);
    if (stateParsed !== null) setState(stateParsed);
    else setState(initialData);
  }, []);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Flex
        flexDir="column"
        bg="main-bg"
        minH="100vh"
        w="full"
        color="white-text"
        userSelect="none"
      >
        <Flex py="4rem" flexDirection="column" align="center">
          <Heading fontSize="3xl" fontWeight={600}>
            Tasker
          </Heading>
          {/* <Text fontSize="20px" fontWeight={600} color="subtle-text">
            by r-fael
          </Text> */}
        </Flex>

        {tasksCount > 0 && (
          <Flex
            position="absolute"
            insetEnd="1"
            top="4rem"
            right="4rem"
            fontSize="22px"
            fontWeight={600}
            gap="6px"
            alignItems="center"
            justifyContent="center"
          >
            <RepeatIcon onClick={handleResetCount} />
            <Text color="green">{tasksCount}</Text>
            <Text>task{tasksCount > 1 ? "s" : ""} completed</Text>
          </Flex>
        )}

        <Flex justify="center" p="0 4rem 4rem 4rem" gap="2rem">
          {state.columnOrder?.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map((taskId) => {
              return state.tasks[taskId];
            });
            return (
              <Column
                addTask={addTask}
                deleteTask={deleteTask}
                key={column.id}
                column={column}
                tasks={tasks}
                handleChange={handleChange}
              />
            );
          })}
        </Flex>
      </Flex>
    </DragDropContext>
  );
}

interface IInitialData {
  tasks: {
    [key: number]: {
      id: number;
      content: string;
      new?: boolean;
      creationDate: Date;
    };
  };
  columns: {
    [key: string]: {
      id: string;
      title: string;
      taskIds: number[];
    };
  };
  columnOrder: string[];
}

const initialData: IInitialData = {
  tasks: {
    // 0: { id: 0, content: "Configure Next.js application" },
    // 1: { id: 1, content: "Configure Next.js and tailwind " },
    // 2: { id: 2, content: "Create sidebar navigation menu" },
    // 3: { id: 3, content: "Create page footer" },
    // 4: { id: 4, content: "Create page navigation menu" },
    // 5: { id: 5, content: "Create page layout" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "TO-DO",
      taskIds: [],
    },
    "column-2": {
      id: "column-2",
      title: "IN-PROGRESS",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "COMPLETED",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3"],
};
