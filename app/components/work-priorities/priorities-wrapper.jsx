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
        {Object.keys(priorities).map((name) => (
          <PriorityRow key={name} name={name} priorities={priorities[name]} />
        ))}
      </tbody>
    </table>
  );
};

export default PrioritiesWrapper;
