import { World, Bodies } from "matter-js";
import { createContext } from "react";
import { RESTITUTION, FRICTION, ANGLE, ANGULARSPEED } from "../configs/ItemBoxConstants";
import { IMAGE_PATH } from "../configs/assetConfig";
import { v4 } from "uuid";

let engine = null;
const gameObjects = [];

let width = 1200;
let height = 720;
let scale = 1;

let messageType = "ENVELOPE";
let presentType = "GIFTBOX";

const ITEM_TYPE = {
    MESSAGE: messageType,
    PRESENT: presentType
};

function setEngine(newEngine) {
    engine = newEngine;
}

function setSize(w, h) {
    width = w;
    height = h;
}

function setMessageType(type) {
    messageType = type;
}

function setPresentType(type) {
    presentType = type;
}

function addGameObject(item, textElement) {
    gameObjects.push([item, textElement]);
}

function setScale(n) {
    scale = n;
}

const attachLabel = (item, text, x) => {
    const textElement = document.createElement('div');
    textElement.className = "userSelectNone itemLabel"
    textElement.innerText = text;

    gameObjects.push([item, textElement]);
    document.body.appendChild(textElement);
};

const getImagePath = (type, index) => {
    const { originPath, paths } = IMAGE_PATH[type];
    return originPath + paths[index % paths.length];
}


/**
 * Matter.js의 엔진에 아이템을 추가
 * @param {string} id 
 * @param {string} sender 
 * @param {IDENTIFIER} label 
 */
function addItem(id, sender, label) {
    if (!id) id = v4();

    const itemType = ITEM_TYPE[label] || "MESSAGE";    // default로 MESSAGE
    const randomX = Math.floor(Math.random() * width);

    const item = Bodies.circle(randomX, 30, 50 * scale, {
        id,
        label,
        restitution: RESTITUTION, 
        friction: FRICTION,
        angle: ANGLE,
        angularSpeed: ANGULARSPEED,
        render: {
            sprite: {
                texture: getImagePath(itemType, randomX),
                xScale: IMAGE_PATH[itemType].scale * scale,
                yScale: IMAGE_PATH[itemType].scale * scale
            }
        }
    });
    if (sender) {
        attachLabel(item, sender, randomX);
    }

    World.add(engine.world, item);
}

export const ItemEventContext = createContext();

export function ItemEventProvider ({ children }) {
    return (
        <ItemEventContext.Provider value={{
            engine,
            gameObjects,
            setEngine,
            setSize,
            setScale,
            setMessageType,
            setPresentType,
            addGameObject,
            addItem,
        }}>
            {children}
        </ItemEventContext.Provider>
    )
}