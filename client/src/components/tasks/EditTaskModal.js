import React, { useContext, useEffect } from 'react'

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

const EditTaskModal = (props) => {
  const showHideClassName = props.show
    ? 'modal-background display-block'
    : 'modal-background display-none'

  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler, setFormData] = useForm({
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
  })

  useEffect(() => {
    setFormData(
      {
        title: {
          value: props.title,
          isValid: true
        },
        description: {
          value: props.description,
          isValid: true
        },
        deadlineDate: {
          value: props.deadline.split('T')[0],
          isValid: true
        },
        deadlineTime: {
          value: props.deadline.split('T', 5)[1].substring(0, 5),
          isValid: true
        }
      },
      true
    )
  }, [props.title, props.description, props.deadline, setFormData])

  const editHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/tasks/${props.id}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          deadline:
            formState.inputs.deadlineDate.value +
            'T' +
            formState.inputs.deadlineTime.value +
            'Z'
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      props.update()
    } catch (e) {}
  }

  const onUpdate = () => {
    editHandler()
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
            initialValue={props.title}
            initialValid={true}
            onInput={inputHandler}
          />
          <Input
            element="textarea"
            id="description"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(1), VALIDATOR_MAXLENGTH(500)]}
            errorText="Description has to be 1-500 characters"
            initialValue={props.description}
            initialValid={true}
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
                initialValue={props.deadline.split('T')[0]}
                initialValid={true}
                onInput={inputHandler}
              />
            </div>
            <div className="table-cell">
              <Input
                element="input"
                id="deadlineTime"
                type="time"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Enter a valid time"
                initialValue={props.deadline.split('T')[1].substring(0, 5)}
                initialValid={true}
                onInput={inputHandler}
              />
            </div>
            <div className="buttons">
              <Button danger onClick={props.handleClose}>
                Close
              </Button>
              <Button disabled={!formState.isValid} onClick={onUpdate}>
                Update
              </Button>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  )
}

export default EditTaskModal
