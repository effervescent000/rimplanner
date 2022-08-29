import PriorityCell from "./priority-cell";

const PriorityRow = ({ name, priorities }) => {
  return (
    <tr>
      <th>{name}</th>
      {priorities.map((prio, idx) => (
        <td key={`${name}-${idx}`}>
          <PriorityCell priority={prio} />
        </td>
      ))}
    </tr>
  );
};

export default PriorityRow;
