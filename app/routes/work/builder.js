import { json } from "@remix-run/node";
import PriorityBuilder from "app/helpers/priorityBuilder";

export const action = async ({ request }) => {
  const body = await request.formData();
  const {
    colonists,
    slaves,
    modList,
    currentPriorities,
    config,
    homeZoneSize,
    growingZones,
    action,
  } = JSON.parse(body.get("values"));
  if (action) {
    // do something with that action
  } else {
    // run a default PB
    const priorityBuilder = new PriorityBuilder({
      pawns: [...colonists, ...slaves],
      modList,
      currentPriorities,
      homeZoneSize,
      growingZones,
      config,
    });
    priorityBuilder.buildSuggestionsV3();
    const suggestions = priorityBuilder.getOrderedPriorities();
    return json({ suggestions });
  }
  throw new Error("Invalid pawns passed to eval builder");
};
