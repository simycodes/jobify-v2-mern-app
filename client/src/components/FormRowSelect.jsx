
const FormRowSelect = ({ name, labelText, optionListValues, defaultValue = "", disabled, onChange }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      <select
        name={name}
        id={name}
        className="form-select"
        defaultValue={defaultValue}
        disabled={disabled || false}
        onChange={onChange}
      >
        {optionListValues.map((optionValue) => {
          return (
            <option key={optionValue} value={optionValue}>
              {optionValue}
            </option>
          );
        })}
      </select>
    </div>
  );
}
export default FormRowSelect