import React from 'react';
import { Paperclip, MessageSquare } from 'lucide-react';
import './Demo.css';

const TaskItem = ({ taskName, startDate, endDate, completedDate }) => (
  <div className="task-item">
    <div className="task-item-content">
      <div>
        <h3 className="task-name">{taskName}</h3>
        <div className="task-dates">
          Start Date: {startDate} End Date: {endDate}
        </div>
      </div>
      <div className="task-icons">
        <Paperclip size={18} />
        <MessageSquare size={18} />
        {completedDate && <div className="task-completed-date">Completed: {completedDate}</div>}
      </div>
    </div>
    <div className="task-color-indicators">
      <div className="color-indicator color-red"></div>
      <div className="color-indicator color-yellow"></div>
      <div className="color-indicator color-green"></div>
      <div className="color-indicator color-blue"></div>
    </div>
  </div>
);

const Demo = () => {
  const tasks = [
    { taskName: "Task Name with long name", startDate: "01/01/2024", endDate: "01/01/2024", completedDate: "01/01/2024" },
    { taskName: "Task Name with long name", startDate: "01/01/2024", endDate: "01/01/2024", completedDate: null },
    { taskName: "Task Name with long name", startDate: "01/01/2024", endDate: "01/01/2024", completedDate: "01/01/2024" },
    { taskName: "Task Name with long name", startDate: "01/01/2024", endDate: "01/01/2024", completedDate: "01/01/2024" },
    { taskName: "Task Name with long name", startDate: "01/01/2024", endDate: "01/01/2024", completedDate: "01/01/2024" },
    { taskName: "Task Name with long name", startDate: "01/01/2024", endDate: "01/01/2024", completedDate: "01/01/2024" },
    { taskName: "Task Name with long name", startDate: "01/01/2024", endDate: "01/01/2024", completedDate: "01/01/2024" },
  ];

  return (
    <div className="task-list-container">
      <div className="task-list-content">
        <h1 className="task-list-title">e-Proposal</h1>
        <h2 className="task-list-subtitle">Proposal</h2>
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <TaskItem key={index} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Demo;
