import { composeImage } from "app/helpers/pawnImageHelpers.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const { body, gender, head, hairDef, hairColor, melanin } = Object.fromEntries(url.searchParams);
  const uri = await composeImage({ body, gender, head, hairDef, hairColor, melanin });
  return new Response(uri, { status: 200 });
};
