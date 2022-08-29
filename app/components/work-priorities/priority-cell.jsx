const PriorityCell = ({ priority: { suggested, current } }) => {
  return <span className={`${suggested !== +current ? "warning" : ""}`}>{suggested}</span>;
};

export default PriorityCell;
