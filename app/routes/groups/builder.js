import { json } from "@remix-run/node";
import GroupsBuilder from "app/helpers/groupsBuilder";

export const action = async ({ request }) => {
  const body = await request.formData();
  const { colonists, prisoners, slaves, config, modList } = JSON.parse(body.get("values"));
  const gb = new GroupsBuilder({ colonists, prisoners, slaves, config, modList });
  return null;
};
