import React from "react";
import { Spinner } from "react-bootstrap";

const ButtonWithProgress = (props) => {
  const { onClick, pendingApiCall, disabled, className, name, text } = props;

  return (
    <button
      className={className || "btn btn-primary btn-sm form-range mb-lg-2"}
      onClick={onClick}
      disabled={disabled}
      name={name}
    >
      {pendingApiCall && <Spinner animation="border" />} {text}
    </button>
  );
};

export default ButtonWithProgress;
