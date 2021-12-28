import React from "react";

const Input = (props) => {
  const { label, error, name, onChange, defaultValue, placeholder, value } =
    props;
  let className = "form-control py-1 d-lg-inline mb-lg-2";
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
        placeholder={placeholder}
        value={value}
      />
      <div className="invalid-feedback">{props.error}</div>
    </div>
  );
};

export default Input;
