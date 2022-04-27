import React, { useContext } from 'react'

import Input from '../input/Input'
import Button from '../button/Button'
import ErrorModal from '../modal/ErrorModal'
import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import { useForm } from '../../hooks/form-hook'
import { useHttpClient } from '../../hooks/http-hook'
import { AuthContext } from '../../context/Auth-context'
import { VALIDATOR_MINLENGTH } from '../../util/validators'

import './UserEditModal.css'

const UserEditModal = (props) => {
  const showHideClassName = props.show
    ? 'user-modal-background display-block'
    : 'user-modal-background display-none'

  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler] = useForm(
    {
      currentPassword: {
        value: '',
        isValid: false
      },
      newPassword: {
        value: '',
        isValid: false
      },
      newPasswordAgain: {
        value: '',
        isValid: false
      }
    },
    false
  )

  const editHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND}/users/${props.id}`,
        'PATCH',
        JSON.stringify({
          currentPassword: formState.inputs.currentPassword.value,
          newPassword: formState.inputs.newPassword.value
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
        {isLoading && <LoadingSpinner asOverlay />}
        <section className="user-modal-main">
          <Input
            element="input"
            id="currentPassword"
            type="password"
            label="Current password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Enter a valid password"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="newPassword"
            type="password"
            label="New password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Enter a valid password"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="newPasswordAgain"
            type="password"
            label="New password again"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Enter a valid password"
            onInput={inputHandler}
          />
          <div className="user-edit-buttons">
            <Button danger onClick={props.handleClose}>
              Close
            </Button>
            <Button
              disabled={
                !formState.isValid ||
                formState.inputs.newPassword.value.localeCompare(
                  formState.inputs.newPasswordAgain.value
                ) !== 0
              }
              onClick={onUpdate}
            >
              Update
            </Button>
          </div>
        </section>
      </div>
    </React.Fragment>
  )
}

export default UserEditModal
