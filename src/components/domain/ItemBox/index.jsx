import { useContext, useEffect, useRef } from "react";
import Matter, { Body } from "matter-js";
import { ItemEventContext } from "../../../context/ItemEventProvider";

const WALL_THICKNESS = 500;
const LABEL_DISTANCE_X_DELTA = -45;
const LABEL_DISTANCE_Y_DELTA = 50;
const ADDITIONAL_WALL_HEIGHT = 0;
const RESOURCE_PATH = process.env.PUBLIC_URL + "/contents-design-birthday";

export default function ItemBox({
    width = 600,
    height = 600,
    backgroundColor = "transparent",
    wallColor = "transparent",
    messages = [],
    presents = [],
    onSelectMessage,
    onSelectPresent,
    handleAddMessage,
    handleAddPresent,
    ...props
}) {
    const containerRef = useRef();
    const canvasRef = useRef();

    height += ADDITIONAL_WALL_HEIGHT;

    const { setEngine, gameObjects } = useContext(ItemEventContext);

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

        // 메시지 아이템 생성
        for (const { message_id, message_sender } of messages) {
            const randomX = Math.floor(Math.random() * width * 0.8) + 50;
            const randomAngle = Math.random();

            const textElement = document.createElement('div');
            textElement.className = "userSelectNone"
            textElement.innerText = message_sender;

            textElement.style.position = 'absolute';
            textElement.style.top = 30 + LABEL_DISTANCE_X_DELTA + 'px';
            textElement.style.left = randomX + LABEL_DISTANCE_Y_DELTA + 'px';
            textElement.style.fontSize = '20px';
            textElement.style.color = 'black';

            const message = Bodies.circle(randomX, 30, 50, {
                id: message_id,
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
            gameObjects.push([message, textElement]);
            document.body.appendChild(textElement);
            World.add(engine.world, message);
        }

        // 선물 아이템 생성
        for (const { present_id, present_sender } of presents) {
            const randomX = Math.floor(Math.random() * width * 0.8) + 50;
            const randomAngle = Math.random();
            const textElement = document.createElement('div');
            textElement.className = "userSelectNone"
            textElement.innerText = present_sender;

            textElement.style.position = 'absolute';
            textElement.style.top = 30 + LABEL_DISTANCE_X_DELTA + 'px';
            textElement.style.left = randomX + LABEL_DISTANCE_Y_DELTA + 'px';
            textElement.style.fontSize = '20px';
            textElement.style.color = 'black';

            const sprite = randomX & 1 ? {
                texture: RESOURCE_PATH + "/giftbox_green.png",
                xScale: 0.4,
                yScale: 0.4
            } : {
                texture: RESOURCE_PATH + "/giftbox_red.png",
                xScale: 0.3,
                yScale: 0.3
            };

            const present = Bodies.circle(randomX, 30, 50, {
                id: present_id,
                label: "present",
                restitution: 0.9, 
                friction: 1,
                angle: randomAngle,
                angularSpeed: 3,
                render: {
                    sprite
                }
            });
            gameObjects.push([present, textElement]);
            document.body.appendChild(textElement);
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