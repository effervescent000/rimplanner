import WorkRow from "./work-row";

const PrioritiesWrapper = ({ priorities }) => {
  return (
    <div className="priorities">
      {priorities.map(({ name, priorities: rawPriorities }, idx) => (
        <WorkRow key={`${name}-${idx}`} name={name} priorities={rawPriorities} />
      ))}
    </div>
  );
};

export default PrioritiesWrapper;
