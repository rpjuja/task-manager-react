import React from 'react'
import TaskCard from './TaskCard'

import './TaskList.css'

const TaskList = (props) => {
  const insertTask = (task) => {
    return (
      <TaskCard
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
        {props.items.length > 0 &&
          props.items.map((task) => {
            return (
              task.status === 0 && (
                <div className="card-padding" key={task.id}>
                  {insertTask(task)}
                </div>
              )
            )
          })}
      </div>
      <div className="grid-col-two">
        <h2>In Progress</h2>
        {props.items.length > 0 &&
          props.items.map((task) => {
            return (
              task.status === 1 && (
                <div className="card-padding" key={task.id}>
                  {insertTask(task)}
                </div>
              )
            )
          })}
      </div>
      <div className="grid-col-three">
        <h2>Done</h2>
        {props.items.length > 0 &&
          props.items.map((task) => {
            return (
              task.status === 2 && (
                <div className="card-padding" key={task.id}>
                  {insertTask(task)}
                </div>
              )
            )
          })}
      </div>
    </div>
  )
}

export default TaskList
