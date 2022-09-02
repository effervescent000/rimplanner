import jimp from "jimp";

import { BASE_ASSET_URL } from "~/constants/constants";

const getHeadFromPath = ({ head, gender }) => {
  if (head) {
    return head.replace("Things/Pawn/Humanlike/", "");
  }
  return `Heads/${gender}/${gender}_Average_Normal`;
};

const rgbToHex = ({ red, green, blue }) =>
  "#" +
  [red, green, blue]
    .map((color) => {
      const hex = Math.round(+color * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

export const composeImage = async ({ gender, head, body, hairDef, hairColor }) => {
  try {
    const baseImage = await jimp.read(BASE_ASSET_URL + `bodies/${body}.png`);
    baseImage.blit(
      await jimp.read(BASE_ASSET_URL + getHeadFromPath({ head, gender }) + "_south.png"),
      0,
      -25
    );
    const hairImage = await jimp.read(BASE_ASSET_URL + `Hairs/${hairDef}_south.png`);
    const [red, green, blue] = hairColor.match(/0\.\d+/g);
    hairImage.color([{ apply: "mix", params: [rgbToHex({ red, green, blue }), 100] }]);
    baseImage.blit(hairImage, 0, -25);
    const url = await baseImage.getBase64Async(jimp.MIME_PNG);
    return url;
  } catch (error) {
    console.log(error);
    return "";
  }
};
