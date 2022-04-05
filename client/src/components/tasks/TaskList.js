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
      {props.items.map((task) => {
        return task.status === 0 ? (
          <div className="grid-col-one">{insertTask(task)}</div>
        ) : task.status === 1 ? (
          <div className="grid-col-two">{insertTask(task)}</div>
        ) : (
          <div className="grid-col-three">{insertTask(task)}</div>
        )
      })}
    </div>
  )
}

export default TaskList
