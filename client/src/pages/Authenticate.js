import React, { useState, useContext } from 'react'

import Button from '../components/button/Button'
import Input from '../components/input/Input'
import { AuthContext } from '../context/Auth-context'
import ErrorModal from '../components/modal/ErrorModal'
import LoadingSpinner from '../components/loadingspinner/LoadingSpinner'
import { useHttpClient } from '../hooks/http-hook'
import { useForm } from '../hooks/form-hook'
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH
} from '../util/validators'

import './Authenticate.css'

const Authenticate = (props) => {
  const auth = useContext(AuthContext)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  })

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (isLoginMode) {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        )
        // console.log(response)
        auth.login(response.userId, response.token, response.isAdmin)
      } catch (err) {}
    } else {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/users/signup`,
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        )
        auth.login(response.userId, response.token, response.isAdmin)
      } catch (err) {}
    }
  }

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        //We need to drop name data in login mode
        {
          ...formState.inputs,
          name: undefined //We can set it to undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs, //We want the current email and password
          name: {
            value: '', //We add the empty name value
            isValid: false //False because the name is empty
          }
        },
        false
      ) //Form is false because name was false
    }

    setIsLoginMode((prevMode) => !prevMode)
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={onSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Name"
              validators={[VALIDATOR_MINLENGTH(1), VALIDATOR_MAXLENGTH(100)]}
              errorText="Enter a name"
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_MAXLENGTH(100)]}
            errorText="Enter a valid email address"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Enter a valid password, at least 6 characters"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? 'Signup' : 'Login'} instead?
        </Button>
      </div>
    </React.Fragment>
  )
}

export default Authenticate
