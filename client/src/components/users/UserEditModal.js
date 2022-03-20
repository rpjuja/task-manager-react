import React, { useContext, useEffect } from "react";

import Input from "../input/Input";
import Button from "../button/Button";
import ErrorModal from "../modal/ErrorModal";
import LoadingSpinner from "../loadingspinner/LoadingSpinner";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/Auth-context";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators";

import "./UserEditModal.css";

const UserEditModal = (props) => {
  const showHideClassName = props.show
    ? "modal display-block"
    : "modal display-none";

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    name: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });

  useEffect(() => {
    setFormData(
      {
        name: {
          value: props.name,
          isValid: true,
        },
        password: {
          value: props.password,
          isValid: true,
        },
      },
      true
    );
  }, [props.name, props.password, setFormData]);

  const editHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/users/${props.id}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.update();
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  const onUpdate = () => {
    editHandler();
    props.handleClose();
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className={showHideClassName}>
        <section className="modal-main">
          <Input
            element="input"
            id="name"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Enter a name"
            onInput={inputHandler}
            initialValue={props.name}
            initialValid={true}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Enter a valid password"
            onInput={inputHandler}
          />
          <Button danger onClick={props.handleClose}>
            Close
          </Button>
          <Button onClick={onUpdate}>Update</Button>
        </section>
      </div>
    </React.Fragment>
  );
};

export default UserEditModal;
