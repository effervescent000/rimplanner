import Warning from "./warning";

const WarningsWrapper = ({ warnings }) => {
  return (
    <div>
      {warnings.map((warning, idx) => (
        <Warning key={idx} warning={warning} />
      ))}
    </div>
  );
};

export default WarningsWrapper;
