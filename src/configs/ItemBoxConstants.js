export const WALL_THICKNESS = 500;
export const LABEL_DISTANCE_X_DELTA = -45;
export const LABEL_DISTANCE_Y_DELTA = 50;
export const ADDITIONAL_WALL_HEIGHT = 0;

// RESTITUTION
// 1에 가까워질수록 튕기는 정도가 높아짐
// min: 0, max: 1
export const RESTITUTION = 0.6;

export const ANGLE = 0;
export const ANGULARSPEED = 1;
export const FRICTION = 1;

// FRAME_RATE
// 초당 프레임 = 1000ms / FRAME
export const FRAME_RATE = 1000 / 30;


/**
 * Matter.js 엔진에 넣을 아이템의 타입
 * @typedef {object} IDENTIFIER
 */
export const IDENTIFIERS = {
    MESSAGE: "MESSAGE",
    PRESENT: "PRESENT"
};
