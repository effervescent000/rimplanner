import { composeImage } from "~/helpers/pawnImageHelpers.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const body = url.searchParams.get("body");
  const gender = url.searchParams.get("gender");
  const head = url.searchParams.get("head");
  const hairDef = url.searchParams.get("hairDef");
  const hairColor = url.searchParams.get("hairColor");
  const uri = await composeImage({ body, gender, head, hairDef, hairColor });
  return new Response(uri, { status: 200 });
};
