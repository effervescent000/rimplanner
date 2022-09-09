import { json } from "@remix-run/node";
import EvaluationBuilder from "~/helpers/evaluationBuilder";

export const action = async ({ request }) => {
  const body = await request.formData();
  const { selectedPawns, playerPawns, modList, config } = JSON.parse(body.get("values"));
  // I'm not actually using the action field right now. If i end up expanding the evalBuilder I might use it
  const action = body.get("action");
  if (selectedPawns.length && playerPawns.length) {
    const eb = new EvaluationBuilder({
      targets: selectedPawns,
      playerPawns,
      modList,
      config,
    });
    eb.fullEval();
    return json({ values: eb.values });
  }
  throw new Error("Invalid pawns passed to eval builder");
};
