const PriorityCell = ({ priority: { suggested, current } }) => {
  return <span className={`${suggested.level !== +current ? "warning" : ""}`}>{suggested}</span>;
};

export default PriorityCell;
