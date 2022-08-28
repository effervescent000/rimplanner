import PriorityCell from "./priority-cell";

const PriorityRow = ({ name, priorities, suggested }) => {
  return (
    <tr>
      <th>{name}</th>
      {priorities.map((prio, idx) => (
        <td key={`${name}-${idx}`}>
          <PriorityCell priority={prio} suggested={suggested[idx]} />
        </td>
      ))}
    </tr>
  );
};

export default PriorityRow;
