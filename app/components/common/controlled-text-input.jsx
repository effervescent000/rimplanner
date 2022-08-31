const ControlledTextInput = ({ value, callback }) => {
  return <input value={value} onChange={(event) => callback(event.target.value)} />;
};

export default ControlledTextInput;
