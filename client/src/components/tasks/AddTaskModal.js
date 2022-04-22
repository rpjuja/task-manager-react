import React, { useContext } from 'react'

import Input from '../input/Input'
import Button from '../button/Button'
import ErrorModal from '../modal/ErrorModal'
import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import { useForm } from '../../hooks/form-hook'
import { useHttpClient } from '../../hooks/http-hook'
import { AuthContext } from '../../context/Auth-context'
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH
} from '../../util/validators'

import './TaskModal.css'

const AddTaskModal = (props) => {
  const showHideClassName = props.show
    ? 'modal-background display-block'
    : 'modal-background display-none'

  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      deadlineDate: {
        value: '',
        isValid: false
      },
      deadlineTime: {
        value: '',
        isValid: false
      }
    },
    false
  )

  const addTaskHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND}/tasks/`,
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          deadline:
            formState.inputs.deadlineDate.value +
            'T' +
            formState.inputs.deadlineTime.value +
            'Z',
          status: props.status,
          list_id: props.selectedList
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      props.update()
    } catch (e) {}
  }

  const onAddTask = () => {
    addTaskHandler()
    props.handleClose()
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className={showHideClassName}>
        {isLoading && <LoadingSpinner />}
        <section className="modal-main">
          <Input
            element="input"
            id="title"
            type="text"
            label="Title"
            validators={[VALIDATOR_MINLENGTH(1), VALIDATOR_MAXLENGTH(50)]}
            errorText="Title has to be 1-50 characters"
            initialValue=""
            initialValid={false}
            onInput={inputHandler}
          />
          <Input
            element="textarea"
            id="description"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(1), VALIDATOR_MAXLENGTH(500)]}
            errorText="Description has to be 1-50 characters"
            initialValue=""
            initialValid={false}
            onInput={inputHandler}
          />
          <h4>Deadline</h4>
          <div className="table">
            <div className="table-cell">
              <Input
                element="input"
                id="deadlineDate"
                type="date"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Enter a valid date"
                initialValue=""
                initialValid={false}
                onInput={inputHandler}
                dataTestid="add-date-input"
              />
            </div>
            <div className="table-cell">
              <Input
                element="input"
                id="deadlineTime"
                type="time"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Enter a valid time"
                initialValue=""
                initialValid={false}
                onInput={inputHandler}
                dataTestid="add-time-input"
              />
            </div>
            <div className="buttons">
              <Button danger onClick={props.handleClose}>
                Close
              </Button>
              <Button disabled={!formState.isValid} onClick={onAddTask}>
                Add Task
              </Button>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  )
}

export default AddTaskModal
