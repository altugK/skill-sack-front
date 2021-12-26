import React from "react";

const Input = (props) => {
  const { label, error, name, onChange, defaultValue } = props;
  let className = "form-control py-1 d-lg-inline";
  if (error !== undefined) {
    className += " is-invalid";
  }
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        draggable
        className={className}
        name={name}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      <div className="invalid-feedback">{props.error}</div>
    </div>
  );
};

export default Input;
