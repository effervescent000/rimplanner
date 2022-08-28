import PriorityRow from "./priority-row";

const PrioritiesWrapper = ({ priorities, labels }) => {
  return (
    <table>
      <thead>
        <tr>
          <th />
          {labels.map(({ name }) => (
            <th key={name}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {priorities.map(({ name, priorities: rawPriorities }, idx) => (
          <PriorityRow key={`${name}-${idx}`} name={name} priorities={rawPriorities} />
        ))}
      </tbody>
    </table>
  );
};

export default PrioritiesWrapper;
