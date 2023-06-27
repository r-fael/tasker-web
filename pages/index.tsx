import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CloseButton, Flex, Heading, Icon } from "@chakra-ui/react";
const Column = dynamic(() => import("../src/Column"), { ssr: false });
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RepeatIcon } from "@chakra-ui/icons";

export default function Home() {
  const [state, setState] = useState({} as IInitialData);
  const [tasksCount, setTasksCount] = useState<number>(0);
  const [priorityFilter, setPriorityFilter] = useState<
    "low" | "medium" | "high" | "none"
  >("none");
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

  const handleChange = (column, task, content) => {
    const newState = { ...state };
    const newTask = { ...task, content: content };
    newState.tasks = {
      ...newState.tasks,
      [newTask.id]: newTask,
    };
    setState(newState);
  };

  const handlePriority = (task) => {
    const newState = { ...state };
    const newTask = { ...task };

    switch (newTask?.priority) {
      case "low":
        newTask.priority = "medium";
        break;
      case "medium":
        newTask.priority = "high";
        break;

      case "high":
        newTask.priority = "low";
        break;
    }
    newState.tasks = {
      ...newState.tasks,
      [newTask.id]: newTask,
    };
    setState(newState);
  };

  const addTask = (title) => {
    const newState = { ...state };
    const id = tasksCount;
    newState.tasks = {
      ...newState.tasks,
      [id]: {
        id: id,
        content: "Empty Task",
        creationDate: new Date(),
        priority: priorityFilter === "none" ? "low" : priorityFilter,
      },
    };
    setTasksCount((prev) => prev + 1);
    localStorage.setItem("tasksCount", `${tasksCount + 1}`);
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
    });
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
    if (tasksCount !== null) setTasksCount(tasksCount);
    if (stateParsed !== null) setState(stateParsed);
    else setState(initialData);
  }, []);

  const priorityColors = {
    low: "green.500",
    medium: "yellow.500",
    high: "red.500",
    none: "white",
  };

  const priorityBorderColors = {
    low: "#22543D",
    medium: "#744210",
    high: "#822727",
    none: "#A0AEC0",
  };

  const CircleIcon = (props) => (
    <Icon viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
        strokeWidth="30"
        stroke={props.selected ? priorityBorderColors[props.priority] : "none"}
      />
    </Icon>
  );
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
        toastStyle={{ backgroundColor: "#1A1D23", color: "white" }}
        closeButton={() => (
          <CloseButton color="white" fontSize="0.6rem" paddingInline="1rem" />
        )}
      />
      <Flex
        flexDir="column"
        bg="main-bg"
        minH="100vh"
        w="full"
        overflowX="hidden"
        color="white-text"
        userSelect="none"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Flex pt="4rem" pb="2rem" flexDirection="column" align="center">
          <Heading fontSize="3xl" fontWeight={600}>
            Tasker
          </Heading>
        </Flex>

        <Flex
          gap="2rem"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxW="100rem"
        >
          <Flex gap="6px" justifySelf="flex-end" alignSelf="flex-end">
            {["low", "medium", "high", "none"].map(
              (priority: "low" | "medium" | "high" | "none") => (
                <CircleIcon
                  key={priority}
                  priority={priority}
                  selected={priorityFilter == priority}
                  fontSize="22px"
                  color={priorityColors[priority]}
                  onClick={() => setPriorityFilter(priority)}
                />
              )
            )}
          </Flex>
          <Flex justify="center" p="0 10% 5% 10%" gap="2rem">
            {state.columnOrder?.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map((taskId) => {
                return state.tasks[taskId];
              });
              return (
                <Column
                  handlePriority={handlePriority}
                  priorityFilter={priorityFilter}
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
      </Flex>
    </DragDropContext>
  );
}

interface IInitialData {
  tasks: {
    [key: number]: {
      id: number;
      content: string;
      creationDate: Date;
      priority: "low" | "medium" | "high";
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
