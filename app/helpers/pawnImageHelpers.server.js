import jimp from "jimp";
import axios from "axios";

import { BASE_ASSET_URL } from "app/constants/constants";

const getHeadFromPath = ({ head, gender }) => {
  if (head) {
    return head.replace(`Things/Pawn/Humanlike/`, "");
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

const getSkinColor = (melanin) => {
  const MELANIN_BREAKPOINTS = [0.166666667, 0.333333333, 0.5, 0.666666667, 0.833333333];
  if (melanin < MELANIN_BREAKPOINTS[0]) return "#f2e1d8";
  if (melanin < MELANIN_BREAKPOINTS[1]) return "#ffe6c8";
  if (melanin < MELANIN_BREAKPOINTS[2]) return "#fce3bc";
  if (melanin < MELANIN_BREAKPOINTS[3]) return "#f5cd98";
  if (melanin < MELANIN_BREAKPOINTS[4]) return "#e8a465";
  return "#694424";
};

export const composeImage = async ({
  gender = "Male",
  head,
  body,
  hairDef,
  hairColor,
  melanin,
}) => {
  try {
    const bodyImageBuffer = await axios({
      method: "get",
      url: BASE_ASSET_URL + `/bodies/${body}.png`,
      responseType: "arraybuffer",
    });
    const baseImage = await jimp.read(bodyImageBuffer.data);
    const headImageBuffer = await axios({
      method: "get",
      url: BASE_ASSET_URL + `/${getHeadFromPath({ head, gender })}_south.png`,
      responseType: "arraybuffer",
    });
    baseImage.blit(await jimp.read(headImageBuffer.data), 0, -25);
    const skinToColor = baseImage.clone();
    skinToColor.color([{ apply: "mix", params: [getSkinColor(melanin), 100] }]);
    baseImage.composite(skinToColor, 0, 0, {
      mode: jimp.BLEND_OVERLAY,
      opacityDest: 0.5,
      opacitySource: 1,
    });
    try {
      const hairImage = await jimp.read(BASE_ASSET_URL + `Hairs/${hairDef}_south.png`);
      const hairToColor = hairImage.clone();
      const [red, green, blue] = hairColor.match(/0\.\d+/g);
      hairToColor.color([{ apply: "mix", params: [rgbToHex({ red, green, blue }), 100] }]);
      hairImage.composite(hairToColor, 0, 0, {
        mode: jimp.BLEND_MULTIPLY,
        opacityDest: 0.5,
        opacitySource: 1,
      });
      baseImage.blit(hairImage, 0, -25);
    } catch (hairError) {
      // console.log("error rendering hair", hairError);
    }
    baseImage.resize(100, 100);
    const url = await baseImage.getBase64Async(jimp.MIME_PNG);
    return url;
  } catch (baseError) {
    return baseError;
  }
};
