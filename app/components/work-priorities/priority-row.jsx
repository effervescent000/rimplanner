import PriorityCell from "./priority-cell";

const PriorityRow = ({ name, priorities }) => {
  return (
    <tr>
      <th>{name}</th>
      {priorities.map((prio, idx) => (
        <PriorityCell key={`${name}-${idx}`} priority={prio} />
      ))}
    </tr>
  );
};

export default PriorityRow;
