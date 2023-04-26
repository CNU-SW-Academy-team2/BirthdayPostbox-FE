import { useContext, useEffect, useRef } from "react";
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

    height += ADDITIONAL_WALL_HEIGHT;

    const { setEngine, setSize, setScale, setMessageType, setPresentType, gameObjects, addItem } = useContext(ItemEventContext);

    useEffect(() => {
        setSize(width, height);
        setScale(scale);
        
        setMessageType(messageType);
        setPresentType(presentType);
        
        const runner = Runner.create();
        runner.delta = FRAME_RATE;   // frame 설정

        const engine = Engine.create();
        setEngine(engine);

        const render = Render.create({
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

        
        const floor = Bodies.rectangle(width/2, height+WALL_THICKNESS/2 - 100 * scale, width, WALL_THICKNESS, {
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
        messages.forEach(({ message_id, message_sender = "" }) => {
            addItem(message_id, message_sender, IDENTIFIERS.MESSAGE);
        });

        // 선물 아이템 생성
        presents.forEach(({ present_id, present_sender = "" }) => {
            addItem(present_id, present_sender, IDENTIFIERS.PRESENT);
        });
        
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
        Events.on(mouseConstraint, "mousemove", (e) => {
            const mousePosition = e.mouse.position;
            const clickedBodies = Matter.Query.point(engine.world.bodies, mousePosition);
            if (clickedBodies[0] && clickedBodies[0].label !== "wall") {
                canvas.className = "grab";
            }
            else {
                canvas.classList.remove("grab");
            }
        })

        Events.on(engine, "beforeUpdate", (e) => {
            const { left, top } = canvas.getBoundingClientRect();

            gameObjects.forEach(([item, textElement]) => {  // sender 요소 위치 업데이트
                textElement.style.top = item.position.y + top + LABEL_DISTANCE_Y_DELTA * scale + "px";
                textElement.style.left = item.position.x + left + LABEL_DISTANCE_X_DELTA * scale + "px";

                // 아이템이 canvas를 탈출 시 다시 원위치로 옮김
                if (item.position.y > 1200 || item.position.x < 0 || item.position.x > width) {
                    Body.setPosition(item, { x: width/2, y: 50 });
                }
            })
        })

        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
        World.add(engine.world, mouseConstraint);

        Runner.run(runner, engine);
        Render.run(render);

        const handleDoubleClick = (e) => {
            const { left, top } = canvas.getBoundingClientRect();
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
            document.querySelectorAll(".userSelectNone").forEach((element) => element.remove());    // useRouter()로 주소 변경 시 textElement가 사라지도록 함
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

