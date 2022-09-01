import jimp from "jimp";

import { BASE_ASSET_URL } from "~/constants/constants";

const getHeadFromPath = ({ head, gender }) => {
  if (head) {
    return head.replace("Things/Pawn/Humanlike/", "");
  }
  return `Heads/${gender}/${gender}_Average_Normal`;
};

export const composeImage = async ({ gender, head, body, hairDef, hairColor }) => {
  const baseImage = await jimp.read(BASE_ASSET_URL + `bodies/${body}.png`);
  baseImage.blit(
    await jimp.read(BASE_ASSET_URL + getHeadFromPath({ head, gender }) + "_south.png"),
    0,
    -25
  );
  console.log("blitted image!");
  const url = await baseImage.getBase64Async(jimp.MIME_PNG);
  return url;
};
