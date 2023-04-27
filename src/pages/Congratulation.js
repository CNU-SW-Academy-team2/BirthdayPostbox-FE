import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ItemBox, Title2 } from "../components/domain";
import { Modal, Spinner } from "../components";
import { ItemEventProvider } from "../context/ItemEventProvider";
import { BACKGROUND_PATH } from "../configs/assetConfig";
import DOMPurify from "dompurify";
import ReactHtmlParser from "html-react-parser";

const PageBackground = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
`;

const ContentContainer = styled.div`
`;

const RoomTitle = styled.h1`
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 48px;
    text-shadow: 0 0 10px white, 0 0 10px white, 0 0 10px white;
    letter-spacing: 2px;
    word-spacing: 2px;
    pointer-events: none;
`;

const DisplayBox = styled.div`
    width: 100%;
    height: 100%;
`;

const MessageContainer = styled.div`
    height: 100%;
    width: 480px;
    margin: auto;
    border-radius: 20px;

    & > * {
        margin-top: 16px;
        display: block;
    }
`;

const PresentContainer = styled.div`
    height: 100%;
    width: 480px;
    margin: auto;
    border-radius: 20px;

    & > * {
        margin-top: 16px;
        display: block;
    }
`;

const Sender = styled.div`
    width: 100%;
    border: 1px solid black;
    padding: 8px 12px;
    box-sizing: border-box;
`;

const Content = styled.div`
    border: 1px solid black;
    padding: 12px 12px;
    height: calc(100% - 80px);
    box-sizing: border-box;
`;

const SpinnerWrapper = styled.div`
    text-align: center;
`;

const Image = styled.img`
    max-width: 400px;
    object-fit: contain;
`;

const ImageWrapper = styled.div`
    display: inline-block;
`;


export default function Congratulation() {
    const { roomId, ownerCode } = useParams();
    const navigate = useNavigate();

    const [roomLoading, setRoomLoading] = useState(true);
    const [itemDetailsLoading, setItemDetailsLoading] = useState(true);
    const [messageDetailVisible, setMessageDetailVisible] = useState(false);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const displayBoxRef = useRef();

    const [messageDetails, setMessageDetail] = useState({
        message_id: "",
        message_sender: "",
        message_content: "",
        room_category : ""
    });

    const [presentDetailVisible, setPresentDetailVisible] = useState(false);
    const [presentDetails, setPresentDetails] = useState({
        present_id: "",
        present_sender: "",
        present_content: "",
        present_img_url: "",
        room_category : ""
    });

    const [roomData, setRoomData] = useState({
        room_name : "",
        room_date : "",
        room_design: "",
        message_design_category: "",
        present_design_category: "",
        messages: [],
        presents: [],
    });

    const getSecureContent = (content) => {
        return ReactHtmlParser(DOMPurify.sanitize(content));
    };


    
    const handleShow = () => {

    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [window.innerHeight, window.innerWidth])

    useEffect(() => {
        const beforeLoading = () => {
            if (roomData.room_design) {
                displayBoxRef.current.style.backgroundImage = `url(${BACKGROUND_PATH}/${roomData.room_design}.png)`;
            }
            else {
                displayBoxRef.current.style.backgroundImage = `url(${BACKGROUND_PATH}/ROOM_DESIGN_1.png)`;
            }
        }

        const fetchData = async () => {
            try {
                const res = await axios.get(`/room-content`, {
                    params: {
                        room_id: roomId
                    }
                });

                if (res.status === 200) {
                    console.log(res.data);
                    setRoomData(res.data);
                    beforeLoading();
                    setRoomLoading(false);
                }
                else {
                    throw new Error('방 정보를 불러올 수 없습니다.');
                }

            } catch (e) {
                alert("허용되지 않은 링크입니다.");
                navigate("/");
            }
        }

        setRoomLoading(true);
        fetchData();
    }, [roomId]);

    const handleSelectMessage = async (id) => {
        setItemDetailsLoading(true);
        setMessageDetailVisible(true);
        try {
            const res = await axios.get('/message', {
                params: {
                    id,
                    owner_code: ownerCode
                }
            });
            if (res.status === 200) {
                setMessageDetail(res.data);
            }
            else {
                throw new Error("메시지 상세 확인 API 오류");
            }
        } catch (e) {
            alert("허용되지 않은 링크입니다.");
            navigate("/");
        }
        setItemDetailsLoading(false);
    }

    const handleSelectPresent = async (id) => {
        setItemDetailsLoading(true);
        setPresentDetailVisible(true);
        try {
            const res = await axios.get('/present', {
                params: {
                    id,
                    owner_code: ownerCode
                }
            });
            if (res.status === 200) {
                setPresentDetails(res.data);
            }
            else {
                throw new Error("선물 상세 확인 API 오류");
            }
        } catch (e) {
            alert("허용되지 않은 링크입니다.");
            navigate("/");
        }
        setItemDetailsLoading(false);
    }

    return (
        <ItemEventProvider>
            <RoomTitle>{roomData.room_name}</RoomTitle>
            <DisplayBox ref={displayBoxRef}>
                {!roomLoading && (
                <>
                    <ItemBox 
                        width={windowWidth}
                        height={windowHeight}
                        style={{ justifyContent: "end" }}
                        scale={1}
                        messages={roomData.messages}
                        presents={roomData.presents}
                        messageType={roomData.message_design_category}
                        presentType={roomData.present_design_category}
                        onSelectMessage={handleSelectMessage}
                        onSelectPresent={handleSelectPresent}
                    />
                </>
                )}
            </DisplayBox>
            <Modal
                visible={messageDetailVisible}
                onClose={setMessageDetailVisible}
                width={720}
                height={800}
                style={{
                    borderRadius: "20px"
                }}
            >
                    {itemDetailsLoading ? (
                        <SpinnerWrapper>
                            <Spinner size={40} />
                        </SpinnerWrapper>
                    ): (
                        <MessageContainer>
                            <Sender>
                                {messageDetails.message_sender}
                            </Sender>
                            <Content className="content">
                                {getSecureContent(messageDetails.message_content)}
                            </Content>
                        </MessageContainer>
                    )}

            </Modal>
            <Modal
                visible={presentDetailVisible}
                onClose={setPresentDetailVisible}
                width={720}
                height={800}
                style={{
                    borderRadius: "20px"
                }}
            >
                    {itemDetailsLoading ? (
                        <SpinnerWrapper>
                            <Spinner size={40} />
                        </SpinnerWrapper>
                    ): (
                        <PresentContainer>
                            <Sender>
                                {presentDetails.present_sender}
                            </Sender>
                            <Content>
                                {getSecureContent(presentDetails.present_content)}
                            </Content>
                            <ImageWrapper>
                                <Image src={presentDetails.present_img_url} alt="이미지 로딩 오류"/>
                            </ImageWrapper>
                        </PresentContainer>
                    )}
            </Modal>
        </ItemEventProvider>
    );
}