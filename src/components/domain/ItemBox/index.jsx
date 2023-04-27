import { useContext, useEffect, useRef, useState } from "react";
import Matter, { Body, Runner, Engine, Render, Bodies, World, Events } from "matter-js";
import { ItemEventContext } from "../../../context/ItemEventProvider";
import { WALL_THICKNESS, LABEL_DISTANCE_X_DELTA, LABEL_DISTANCE_Y_DELTA, ADDITIONAL_WALL_HEIGHT, FRAME_RATE, IDENTIFIERS } from "../../../configs/ItemBoxConstants";

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
    messageType = "ENVELOPE",
    presentType = "GIFT_BOX",
    ...props
}) {
    const containerRef = useRef();
    const canvasRef = useRef();
    const [engine, setEngine] = useState(null);
    const [render, setRender] = useState(null);

    const [floor, setFloor] = useState(null);
    const [leftWall, setLeftWall] = useState(null);
    const [rightWall, setRightWall] = useState(null);
    const [ceiling, setCeling] = useState(null);
    height += ADDITIONAL_WALL_HEIGHT;

    const { setEngine: putEngine, setSize, setScale, setMessageType, setPresentType, gameObjects, addItem } = useContext(ItemEventContext);

    // window resize 시 캔버스크기 및 위치 조절
    useEffect(() => {
        if (engine && render) {
            render.canvas.width = width;
            render.canvas.height = height;
            canvasRef.current.style.width = width + "px";
            canvasRef.current.style.height = height + "px";

            render.bounds.max.x = width;
            render.bounds.max.y = height;

            Engine.update(engine, FRAME_RATE);
        }
    }, [width, height, engine, render])


    // window resize 시 벽의 크기 및 위치 조절
    useEffect(() => {
        if (engine && render && floor && rightWall && leftWall && ceiling) {
            // width/2, height+WALL_THICKNESS/2 - 100 * scale, width, WALL_THICKNESS
            Body.setPosition(floor, {
                x: width/2,
                y: height + WALL_THICKNESS/2 - 100*scale
            })
            Body.scale(floor, width / (floor.bounds.max.x - floor.bounds.min.x), 1)

            // width/2, -WALL_THICKNESS/2 + 20, width, WALL_THICKNESS
            Body.setPosition(ceiling, {
                x: width/2,
                y: -WALL_THICKNESS/2 + 20
            })
            Body.scale(ceiling, width / (ceiling.bounds.max.x - ceiling.bounds.min.x), 1)

            // width+WALL_THICKNESS/2, height/2, WALL_THICKNESS, height
            Body.setPosition(rightWall, {
                x: width + WALL_THICKNESS / 2,
                y: height / 2
            });
            Body.scale(rightWall, 1, height / (rightWall.bounds.max.y - rightWall.bounds.min.y))


            // -WALL_THICKNESS/2, height/2, WALL_THICKNESS, height
            Body.setPosition(leftWall, {
                x: -WALL_THICKNESS/2,
                y: height / 2
            });
            Body.scale(leftWall, 1, height / (leftWall.bounds.max.y - leftWall.bounds.min.y))

            // floor.position.x = width/2;
            // floor.position.y = height+WALL_THICKNESS/2 - 100 * scale;
            Engine.update(engine, FRAME_RATE);
        }
    }, [width, height, engine, render, floor, rightWall, leftWall, ceiling])


    useEffect(() => {
        setSize(width, height);
        setScale(scale);
        
        setMessageType(messageType);
        setPresentType(presentType);
    }, [width, height, scale, messageType, presentType]);

    useEffect(() => {
        const newEngine = Engine.create();
        setEngine(newEngine);
    }, []);

    useEffect(() => {
        if (engine) {
            putEngine(engine);
            const newRender = Render.create({
                element: containerRef.current,
                engine: engine,
                canvas: canvasRef.current,
                options: {
                    width,
                    height,
                    background: backgroundColor,
                    wireframes: false,
                }
            });

            setRender(newRender);

            const runner = Runner.create();
            runner.delta = FRAME_RATE;   // frame 설정
            Runner.run(runner, engine);
            Render.run(newRender);
        }
    }, [engine]);


    useEffect(() => {
        if (engine && render) {
            const newFloor = Bodies.rectangle(width/2, height+WALL_THICKNESS/2 - 100 * scale - 40, width, WALL_THICKNESS, {
                id: 10000,
                label: "wall",
                isStatic: true,
                render: {
                    fillStyle: wallColor
                }
            })

            const newLeftWall = Bodies.rectangle(-WALL_THICKNESS/2, height/2, WALL_THICKNESS, height, {
                id: 10001,
                label: "wall",
                isStatic: true,
                render: {
                    fillStyle: wallColor
                }
            })
    
            const newRightWall = Bodies.rectangle(width+WALL_THICKNESS/2, height/2, WALL_THICKNESS, height, {
                id: 10002,
                label: "wall",
                isStatic: true,
                render: {
                    fillStyle: wallColor
                }
            })
            
            const newCeiling = Bodies.rectangle(width/2, -WALL_THICKNESS/2 + 20, width, WALL_THICKNESS, {
                id: 10003,
                label: "wall",
                isStatic: true,
                render: {
                    fillStyle: wallColor
                }
            })

            setFloor(newFloor);
            setLeftWall(newLeftWall);
            setRightWall(newRightWall);
            setCeling(newCeiling);

            const mouse = Matter.Mouse.create(canvasRef.current);
    
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

            World.add(engine.world, [newFloor, newLeftWall, newRightWall, newCeiling, mouseConstraint]);

            // 메시지 아이템 생성
            messages.forEach(({ message_id, message_sender = "" }) => {
                addItem(message_id, message_sender, IDENTIFIERS.MESSAGE);
            });

            // 선물 아이템 생성
            presents.forEach(({ present_id, present_sender = "" }) => {
                addItem(present_id, present_sender, IDENTIFIERS.PRESENT);
            });

            const canvas = canvasRef.current;
            // 아이템에 마우스 오버 시 grab이라는 클래스를 추가해 css 효과를 받도록 함
            const handleMousemove = (e) => {
                const mousePosition = e.mouse.position;
                const clickedBodies = Matter.Query.point(engine.world.bodies, mousePosition);
                if (clickedBodies[0] && clickedBodies[0].label !== "wall") {
                    canvas.className = "grab";
                }
                else {
                    canvas.classList.remove("grab");
                }
            }
    
            Events.on(mouseConstraint, "mousemove", handleMousemove);
    
            mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
            mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    
    
            const handleDoubleClick = (e) => {
                const { left, top } = canvasRef.current.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                const bodies = Matter.Query.point(engine.world.bodies, { x, y });
                // 더블클릭한 위치에 아이템이 존재한다면 id에 따라 이벤트
    
                if (bodies[0]) {
                    if (bodies[0].label === IDENTIFIERS.MESSAGE && onSelectMessage) {
                        onSelectMessage(bodies[0].id);
                    }
                    else if (bodies[0].label === IDENTIFIERS.PRESENT && onSelectPresent) {
                        onSelectPresent(bodies[0].id);
                    }
                }
                
            }
    
            document.addEventListener('dblclick', handleDoubleClick);
            return () => {
                document.removeEventListener('dblclick', handleDoubleClick);
                Events.off(mouseConstraint, "mousemove", handleMousemove);
                document.querySelectorAll(".userSelectNone").forEach((element) => element.remove());    // useRouter()로 주소 변경 시 textElement가 사라지도록 함
            }
        }

    }, [engine, render]);

    useEffect(() => {
        if (engine && render) {
            const handleOut = () => {
                const { left, top } = render.canvas.getBoundingClientRect();
    
                gameObjects.forEach(([item, textElement]) => {  // sender 요소 위치 업데이트
                    textElement.style.top = item.position.y + top + LABEL_DISTANCE_Y_DELTA * scale + "px";
                    textElement.style.left = item.position.x + left + LABEL_DISTANCE_X_DELTA * scale + "px";
    
                    // 아이템이 canvas를 탈출 시 다시 원위치로 옮김
                    if (item.position.y > 1200 || item.position.x < 0 || item.position.x > width) {
                        Body.setPosition(item, { x: width/2, y: 50 });
                    }
                })
            };
    
            if (engine) {
                Events.on(engine, "beforeUpdate", handleOut);
            }
    
            return () => {
                Events.off(engine, "beforeUpdate", handleOut);
            }
        }
        
    }, [engine, render, width, scale]);

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

