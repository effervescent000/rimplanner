import PriorityCell from "./priority-cell";

const WorkRow = ({ name, priorities }) => {
  return (
    <div className="flex row">
      <div>{name}</div>
      {priorities.map((prio, idx) => (
        <PriorityCell key={`${name}-${idx}`} priority={prio} />
      ))}
    </div>
  );
};

export default WorkRow;
