const ASSET_PATH = process.env.PUBLIC_URL + "/assets";

export const BACKGROUND_PATH = ASSET_PATH + "/background";
export const CAKE_PATH = ASSET_PATH + "/cake";
export const CHOCOLATE_PATH = ASSET_PATH + "/chocolate";
export const ENVELOPE_PATH = ASSET_PATH + "/envelope";
export const GIFTBOX_PATH = ASSET_PATH + "/giftbox";
export const TAFFY_PATH = ASSET_PATH + "/taffy";

export const IMAGE_PATH = {
    CAKE: {
        originPath: CAKE_PATH,
        paths: [
          "/chocolate.png",
          "/fresh-berry.png",
          "/orange.png",
          "/strawberries1.png",
          "/strawberries2.png",
        ],
        scale: 0.035,
      },
      CHOCOLATE: {
        originPath: CHOCOLATE_PATH,
        paths: [
          "/chocolate1.png",
          "/chocolate2.png",
          "/chocolate3.png",
          "/chocolate4.png",
          "/chocolate5.png",
        ],
        scale: 0.2,
      },
      ENVELOPE: {
        originPath: ENVELOPE_PATH,
        paths: [
          "/envelope1.png",
          "/envelope2.png",
          "/envelope3.png",
          "/envelope5.png",
        ],
        scale: 0.2,
      },
      GIFTBOX: {
        originPath: GIFTBOX_PATH,
        paths: [
          "/giftbox_1.png",
          "/giftbox_2.png",
          "/giftbox_3.png",
          "/giftbox_4.png",
          "/giftbox_5.png",
        ],
        scale: 0.25,
      },
      TAFFY: {
        originPath: TAFFY_PATH,
        paths: [
          "/taffy1.png",
          "/taffy2.png",
          "/taffy3.png",
          "/taffy4.png",
          "/taffy5.png",
        ],
        scale: 0.2,
      }
};