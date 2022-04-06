import React from 'react'
import TaskCard from './TaskCard'

import './TaskList.css'

const TaskList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>No tasks found.</h2>
      </div>
    )
  }

  const insertTask = (task) => {
    return (
      <TaskCard
        key={task.id}
        id={task.id}
        title={task.title}
        description={task.description}
        deadline={task.deadline}
        status={task.status}
        update={props.update}
      />
    )
  }

  return (
    <div className="tasks-grid">
      <div className="grid-col-one">
        <h2>Backlog</h2>
      </div>
      <div className="grid-col-two">
        <h2>In Progress</h2>
      </div>
      <div className="grid-col-three">
        <h2>Done</h2>
      </div>
      {props.items.map((task) => {
        return task.status === 0 ? (
          <div className="grid-col-one card-padding">{insertTask(task)}</div>
        ) : task.status === 1 ? (
          <div className="grid-col-two card-padding">{insertTask(task)}</div>
        ) : (
          <div className="grid-col-three card-padding">{insertTask(task)}</div>
        )
      })}
    </div>
  )
}

export default TaskList
