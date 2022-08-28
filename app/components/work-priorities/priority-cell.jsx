const PriorityCell = ({ priority, suggested }) => {
  return (
    <span className={`${suggested.level !== +priority ? "warning" : ""}`}>
      {suggested.level || ""}
    </span>
  );
};

export default PriorityCell;
