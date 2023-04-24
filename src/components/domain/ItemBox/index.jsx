import { useContext, useEffect, useRef } from "react";
import Matter, { Body } from "matter-js";
import { ItemEventContext } from "../../../context/ItemEventProvider";
import { CAKE_PATH, CHOCOLATE_PATH, ENVELOPE_PATH, GIFTBOX_PATH, TAFFY_PATH } from "../../../path";

const WALL_THICKNESS = 500;
const LABEL_DISTANCE_X_DELTA = -45;
const LABEL_DISTANCE_Y_DELTA = 50;
const ADDITIONAL_WALL_HEIGHT = 0;
const RESTITUTION = 0.6;    // limit: 0 ~ 1
const ANGULARSPEED = 1;
const FRICTION = 1;

const IMAGE_PATH = {
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
          "/envelope4.png",
          "/envelope5.png",
        ],
        scale: 0.4,
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

export default function ItemBox({
    width = 600,
    height = 600,
    scale = 1,
    backgroundColor = "transparent",
    wallColor = "transparent",
    messages = [],
    presents = [],
    onSelectMessage,
    onSelectPresent,
    handleAddMessage,
    handleAddPresent,
    messageType = "ENVELOPE",
    presentType = "GIFTBOX",
    ...props
}) {
    const containerRef = useRef();
    const canvasRef = useRef();

    height += ADDITIONAL_WALL_HEIGHT;

    const { setEngine, gameObjects } = useContext(ItemEventContext);

    const getImagePath = (type, index) => {
        const { originPath, paths } = IMAGE_PATH[type];
        return originPath + paths[index % paths.length];
    }

    useEffect(() => {
        let Engine = Matter.Engine;
        let Render = Matter.Render;
        let World = Matter.World;
        let Bodies = Matter.Bodies;

        let engine = Engine.create();
        setEngine(engine);

        let render = Render.create({
            element: containerRef.current,
            engine: engine,
            canvas: canvasRef.current,
            options: {
                width,
                height,
                background: backgroundColor,
                wireframes: false
            }
        });

        
        const floor = Bodies.rectangle(width/2, height+WALL_THICKNESS/2, width, WALL_THICKNESS, {
            id: 10000,
            label: "wall",
            isStatic: true,
            render: {
                fillStyle: wallColor
            }
        })

        const leftWall = Bodies.rectangle(-WALL_THICKNESS/2, height/2, WALL_THICKNESS, height, {
            id: 10001,
            label: "wall",
            isStatic: true,
            render: {
                fillStyle: wallColor
            }
        })

        const rightWall = Bodies.rectangle(width+WALL_THICKNESS/2, height/2, WALL_THICKNESS, height, {
            id: 10002,
            label: "wall",
            isStatic: true,
            render: {
                fillStyle: wallColor
            }
        })

        const ceiling = Bodies.rectangle(width/2, -WALL_THICKNESS/2, width, WALL_THICKNESS, {
            id: 10003,
            label: "wall",
            isStatic: true,
            render: {
                fillStyle: wallColor
            }
        })


        World.add(engine.world, [floor, leftWall, rightWall, ceiling]);

        const attachLabel = (item, text, x) => {
            const textElement = document.createElement('div');
            textElement.className = "userSelectNone"
            textElement.innerText = text;

            textElement.style.position = 'absolute';
            textElement.style.top = 30 + LABEL_DISTANCE_X_DELTA + 'px';
            textElement.style.left = x + LABEL_DISTANCE_Y_DELTA + 'px';
            textElement.style.fontSize = '20px';
            textElement.style.color = 'black';

            gameObjects.push([item, textElement]);
            document.body.appendChild(textElement);
        };

        // 메시지 아이템 생성
        for (const { message_id, message_sender } of messages) {
            const randomX = Math.floor(Math.random() * width * 0.8) + 50;
            const randomAngle = Math.random();

            const message = Bodies.circle(randomX, 30, 50 * scale, {
                id: message_id,
                label: "message",
                restitution: RESTITUTION, 
                friction: FRICTION,
                angle: randomAngle,
                angularSpeed: ANGULARSPEED,
                render: {
                    sprite: {
                        texture: getImagePath(messageType, randomX),
                        xScale: IMAGE_PATH[messageType].scale * scale,
                        yScale: IMAGE_PATH[messageType].scale * scale
                    }
                }
            });
            if (message_sender) {
                attachLabel(message, message_sender, randomX);
            }
            World.add(engine.world, message);
        }

        // 선물 아이템 생성
        for (const { present_id, present_sender } of presents) {
            const randomX = Math.floor(Math.random() * width * 0.8) + 50;
            const randomAngle = Math.random();

            const present = Bodies.circle(randomX, 30, 50 * scale, {
                id: present_id,
                label: "present",
                restitution: RESTITUTION, 
                friction: FRICTION,
                angle: randomAngle,
                angularSpeed: ANGULARSPEED,
                render: {
                    sprite: {
                        texture: getImagePath(presentType, randomX),
                        xScale: IMAGE_PATH[presentType].scale * scale,
                        yScale: IMAGE_PATH[presentType].scale * scale
                    }
                }
            });

            if (present_sender) {
                attachLabel(present, present_sender, randomX);
            }
            World.add(engine.world, present);
        }
        
        const canvas = canvasRef.current;
        const mouse = Matter.Mouse.create(canvas);

        // 마우스로 아이템을 움직일 수 있게 해줌
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse,
            constraint: {
              stiffness: 0.1,
              render: {
                visible: false
              }
            }
        });

        // 아이템에 마우스 오버 시 grab이라는 클래스를 추가해 css 효과를 받도록 함
        Matter.Events.on(mouseConstraint, "mousemove", (e) => {
            const mousePosition = e.mouse.position;
            const clickedBodies = Matter.Query.point(engine.world.bodies, mousePosition);
            if (clickedBodies[0] && clickedBodies[0].label !== "wall") {
                canvas.className = "grab";
            }
            else {
                canvas.classList.remove("grab");
            }
        })

        Matter.Events.on(engine, "beforeUpdate", (e) => {
            const { left, top } = canvas.getBoundingClientRect();

            gameObjects.forEach(([item, textElement]) => {  // sender 요소 위치 업데이트
                textElement.style.top = item.position.y + top + LABEL_DISTANCE_Y_DELTA + "px";
                textElement.style.left = item.position.x + left + LABEL_DISTANCE_X_DELTA + "px";

                // 아이템이 canvas를 탈출 시 다시 원위치로 옮김
                if (item.position.y > 1200 || item.position.x < 0 || item.position.x > width) {
                    Body.setPosition(item, { x: width/2, y: 50 });
                }
            })
        })

        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
        World.add(engine.world, mouseConstraint);

        Matter.Runner.run(engine);
        Render.run(render);

        const handleDoubleClick = (e) => {
            const { left, top } = canvas.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const bodies = Matter.Query.point(engine.world.bodies, { x, y });

            // 더블클릭한 위치에 아이템이 존재한다면 id에 따라 이벤트
            if (bodies[0]) {
                if (bodies[0].label === "message" && onSelectMessage) {
                    onSelectMessage(bodies[0].id);
                }
                else if (bodies[0].label === "present" && onSelectPresent) {
                    onSelectPresent(bodies[0].id);
                }
            }
            
        }

        document.addEventListener('dblclick', handleDoubleClick);

        handleAddMessage && handleAddMessage();
        handleAddPresent && handleAddPresent();
        
        return () => {
            document.removeEventListener('dblclick', handleDoubleClick);
            document.querySelectorAll(".userSelectNone").forEach((element) => element.remove());    // useRouter()로 주소 변경 시 textElement가 사라지지 않는 경우가 있음
        }
        
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                ...props.style,
                width,
                height,
                overflow: "hidden"
            }}
        >
            <canvas ref={canvasRef}/>
        </div>
    )
}