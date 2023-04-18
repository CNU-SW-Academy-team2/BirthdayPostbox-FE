import { World, Bodies } from "matter-js";
import { createContext } from "react";

const WALL_THICKNESS = 100;
const LABEL_DISTANCE_X_DELTA = -45;
const LABEL_DISTANCE_Y_DELTA = 50;

let engine = null;
const gameObjects = [];
let width = 1200;
const RESOURCE_PATH = process.env.PUBLIC_URL + "/contents-design-birthday";

function setEngine(newEngine) {
    engine = newEngine;
}

function addGameObject(item, textElement) {
    gameObjects.push([item, textElement]);
}

function makeTextElement(text, randomX) {
    const textElement = document.createElement('div');
    textElement.className = "userSelectNone"
    textElement.innerText = text;

    textElement.style.position = 'absolute';
    textElement.style.top = 30 + LABEL_DISTANCE_X_DELTA + 'px';
    textElement.style.left = randomX + LABEL_DISTANCE_Y_DELTA + 'px';
    textElement.style.fontSize = '20px';
    textElement.style.color = 'black';
    
    return textElement;
}

function addMessage(sender) {
    const randomX = Math.floor(Math.random() * width * 0.8) + 50;
    const randomAngle = Math.random();
    const textElement = makeTextElement(sender, randomX);

    const message = Bodies.circle(randomX, 30, 50, {
        label: "message",
        restitution: 0.9,
        friction: 1,
        angle: randomAngle,
        angularSpeed: 3,
        render: {
            sprite: {
                texture: RESOURCE_PATH + "/basiccake.png",
                xScale: 0.3,
                yScale: 0.3
            }
        }
    });
    
    World.add(engine.world, message);
    document.body.appendChild(textElement);
    gameObjects.push([message, textElement]);
}

function addPresent(sender) {
    const randomX = Math.floor(Math.random() * width * 0.8) + 50;
    const randomAngle = Math.random();
    const textElement = makeTextElement(sender, randomX);

    const sprite = randomX & 1 ? {
        texture: RESOURCE_PATH + "/giftbox_green.png",
        xScale: 0.4,
        yScale: 0.4
    } : {
        texture: RESOURCE_PATH + "/giftbox_red.png",
        xScale: 0.3,
        yScale: 0.3
    };

    const present = Bodies.circle(randomX, WALL_THICKNESS+30, 50, {
        label: "present",
        restitution: 0.9, 
        friction: 1,
        angle: randomAngle,
        angularSpeed: 3,
        render: {
            sprite
        }
    });
    
    World.add(engine.world, present);
    document.body.appendChild(textElement);
    gameObjects.push([present, textElement]);
}

export const ItemEventContext = createContext();

export function ItemEventProvider ({ children }) {
    return (
        <ItemEventContext.Provider value={{
            engine,
            gameObjects,
            setEngine,
            addGameObject,
            addMessage,
            addPresent
        }}>
            {children}
        </ItemEventContext.Provider>
    )
}