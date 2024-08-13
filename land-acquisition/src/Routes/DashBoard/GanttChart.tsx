import React, { useState, useEffect } from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import styled from "styled-components";

const GanttDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  background-color: aliceblue;
`;

const GanttContainer = styled.div`
  position: relative;
  width: 100%;
  height: 700px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: white;
    color: #333;
    font-size: 14px;
  }

  button {
    background-color: #00575d;
    color: white;
    border: none;
    padding: 8px 12px;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
  }

  button:hover {
    background-color: #2a888f;
  }
`;

const TaskWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ddd;

  .task-name {
    flex: 1;
    text-align: center;
  }

  .task-date {
    width: 20%;
    text-align: center;
  }
`;

interface CustomTask extends Task {
  assignee?: string;
  priority?: string;
}

const GanttChart = () => {
  const [tasks, setTasks] = useState<CustomTask[]>([
    // Add the tasks here
    {
      start: new Date(2024, 6, 25),
      end: new Date(2024, 7, 29),
      name: "Q-1 Release",
      id: "Q1Release",
      type: "project",
      progress: 60,
      hideChildren: false,
    },
    {
      start: new Date(2024, 6, 26),
      end: new Date(2024, 7, 5),
      name: "Roadmap",
      project: "Q1Release",
      type: "project",
      id: "Roadmap",
      progress: 45,
      hideChildren: false,
    },
    {
      start: new Date(2024, 7, 1),
      end: new Date(2024, 7, 3),
      name: "Batch Editing",
      project: "Roadmap",
      type: "task",
      id: "BatchEditing",
      progress: 55,
      assignee: "Martin Tamer",
      priority: "High",
      dependencies: ["Roadmap"],
    },
    {
      start: new Date(2024, 7, 4),
      end: new Date(2024, 7, 7),
      name: "PDF Export",
      project: "Roadmap",
      type: "task",
      id: "PDFExport",
      progress: 100,
      assignee: "Rose Fuller",
      priority: "Normal",
      dependencies: ["BatchEditing"],
    },
    {
      start: new Date(2024, 7, 8),
      end: new Date(2024, 7, 10),
      name: "Tree Grid",
      project: "Roadmap",
      type: "task",
      id: "TreeGrid",
      progress: 40,
      assignee: "Fuller King",
      priority: "Critical",
      dependencies: ["PDFExport"],
    },

    // Project 2
    {
      start: new Date(2024, 8, 1),
      end: new Date(2024, 9, 15),
      name: "Q-2 Release",
      id: "Q2Release",
      type: "project",
      progress: 70,
      hideChildren: false,
    },
    {
      start: new Date(2024, 8, 2),
      end: new Date(2024, 8, 15),
      name: "Feature Development",
      project: "Q2Release",
      type: "project",
      id: "FeatureDevelopment",
      progress: 50,
      hideChildren: false,
    },
    {
      start: new Date(2024, 8, 5),
      end: new Date(2024, 8, 12),
      name: "New Feature",
      project: "FeatureDevelopment",
      type: "task",
      id: "NewFeature",
      progress: 30,
      assignee: "John Doe",
      priority: "High",
      dependencies: ["FeatureDevelopment"],
    },
    {
      start: new Date(2024, 8, 13),
      end: new Date(2024, 8, 20),
      name: "Testing",
      project: "FeatureDevelopment",
      type: "task",
      id: "Testing",
      progress: 20,
      assignee: "Jane Smith",
      priority: "Normal",
      dependencies: ["NewFeature"],
    },

    // Project 3
    {
      start: new Date(2024, 10, 1),
      end: new Date(2024, 11, 30),
      name: "Q-3 Release",
      id: "Q3Release",
      type: "project",
      progress: 80,
      hideChildren: false,
    },
    {
      start: new Date(2024, 10, 2),
      end: new Date(2024, 10, 15),
      name: "UI Redesign",
      project: "Q3Release",
      type: "project",
      id: "UIRedesign",
      progress: 60,
      hideChildren: false,
    },
    {
      start: new Date(2024, 10, 5),
      end: new Date(2024, 10, 12),
      name: "Design Mockups",
      project: "UIRedesign",
      type: "task",
      id: "DesignMockups",
      progress: 90,
      assignee: "Emily Clark",
      priority: "High",
      dependencies: ["UIRedesign"],
    },
    {
      start: new Date(2024, 10, 13),
      end: new Date(2024, 10, 20),
      name: "User Feedback",
      project: "UIRedesign",
      type: "task",
      id: "UserFeedback",
      progress: 10,
      assignee: "Michael Brown",
      priority: "Critical",
      dependencies: ["DesignMockups"],
    },
  ]);

  useEffect(() => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        styles: getUpdatedTaskStyles(task),
      }))
    );
  }, []);

  const getUpdatedTaskStyles = (task: Task) => {
    if (task.progress === 100) {
      return { progressColor: "#80AF81", backgroundColor: "#4CAF50" };
    } else if (isEndDateBeforeToday(task.end)) {
      return { progressColor: "red", backgroundColor: "#E57373" };
    } else {
      return { progressColor: "#6EACDA", backgroundColor: "#64B5F6" };
    }
  };

  const isEndDateBeforeToday = (endDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  };

  const onTaskChange = (task: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, ...task } : t))
    );
  };

  const onProgressChange = (task: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, ...task } : t))
    );
  };

  const onDblClick = (task: Task) => {
    console.log("Task double clicked:", task);
  };

  const onClick = (task: Task) => {
    console.log("Task clicked:", task);
  };

  const onExpanderClick = (task: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t
      )
    );
  };

  const onExpandAll = () => {
    setTasks(prevTasks =>
      prevTasks.map(task => ({
        ...task,
        hideChildren: false,
      }))
    );
  };

  const onCollapseAll = () => {
    setTasks(prevTasks =>
      prevTasks.map(task => ({
        ...task,
        hideChildren: true,
      }))
    );
  };

  // Toggle all tasks between expanded and collapsed
  const toggleAllTasks = () => {
    setTasks(prevTasks =>
      prevTasks.map(task => ({
        ...task,
        hideChildren: !areAllExpanded,
      }))
    );
    setAreAllExpanded(!areAllExpanded); // Toggle the state
  };

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [showTaskList, setShowTaskList] = useState(false)
  const [listCellWidth, setListCellWidth] = useState<string>("160px")
  const [showDates, setShowDates] = useState(false)
  const [areAllExpanded, setAreAllExpanded] = useState(false); // Track if tasks are expanded

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setViewMode(event.target.value as ViewMode);
  };

  const handleTaskList = () => {
    setShowTaskList(prevState => {
      const newVisibility = !prevState;
      setListCellWidth(newVisibility ? "160px" : ""); // Adjust listCellWidth based on visibility
      return newVisibility;
    });
  };

  const handleDates = () => {
    setShowDates(prevState => {
      const newShowDates = !prevState;
      const elementsToUpdate = document.querySelectorAll('._34SS0, ._1nBOt');
      elementsToUpdate.forEach(element => {
        if (newShowDates) {
          element.classList.add("hide-not-first-child");
        } else {
          element.classList.remove("hide-not-first-child");
        }
      });
      return newShowDates;
    });
  };

  useEffect(() => {
    // Clean up the class on component unmount
    return () => {
      const elementsToUpdate = document.querySelectorAll('._34SS0, ._1nBOt');
      elementsToUpdate.forEach(element => {
        element.classList.remove("hide-not-first-child");
      });
    };
  }, []);

  const renderTask = (task: Task) => (
    <TaskWrapper key={task.id}>
      <div className="task-date">{task.start.toLocaleDateString()}</div>
      <div className="task-name">{task.name}</div>
      <div className="task-date">{task.end.toLocaleDateString()}</div>
    </TaskWrapper>
  );

  return (
    <GanttContainer>
      <ControlContainer>
        <div>
          {/* <button onClick={onExpandAll}>Expand All</button>
          <button onClick={onCollapseAll}>Collapse All</button> */}
          <button onClick={toggleAllTasks}>
            {areAllExpanded ? 'Expand All' : 'Collapse All'}
          </button>
          {/* <button onClick={handleTaskList}>
            {showTaskList ? "Hide Task List" : "Show Task List"}
          </button> */}
          <button onClick={handleDates}>
            {showDates ? "Show Dates" : "Hide Dates"}
          </button>
        </div>
        <select onChange={handleViewModeChange} value={viewMode}>
          <option value={ViewMode.Day}>Day</option>
          <option value={ViewMode.Week}>Week</option>
          <option value={ViewMode.Month}>Month</option>
          <option value={ViewMode.Year}>Year</option>
        </select>
      </ControlContainer>
      <GanttDiv>
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          onDateChange={onTaskChange}
          onProgressChange={onProgressChange}
          onDoubleClick={onDblClick}
          onClick={onClick}
          onExpanderClick={onExpanderClick}
          ganttHeight={700}
          rowHeight={50}
          columnWidth={65}
          barFill={60}
          arrowIndent={20}
          handleWidth={8}
          fontSize={"14"}
          listCellWidth={listCellWidth}
          todayColor={'lightgrey'}

        />
      </GanttDiv>
    </GanttContainer>
  );
};

export default GanttChart;
