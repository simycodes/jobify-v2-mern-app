const FormRow = ({ type, name, labelText, defaultValue, disabled, onChange }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-input"
        defaultValue={defaultValue || ""}
        required
        disabled={disabled || false}
        onChange={onChange}
      />
    </div>
  );
};
export default FormRow