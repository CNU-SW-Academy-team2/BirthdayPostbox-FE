import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ItemBox, Title2 } from "../components/domain";
import { Modal } from "../components";
import { ItemEventProvider } from "../context/ItemEventProvider";
import { BACKGROUND_PATH } from "../configs/assetConfig";

const PageBackground = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
`;

const ContentContainer = styled.div`
`;

const DisplayBox = styled.div`
    width: 100%;
    height: 100%;
`;


export default function Congratulation() {
    const { roomId, ownerCode } = useParams();
    const navigate = useNavigate();

    const [roomLoading, setRoomLoading] = useState(true);
    const [itemDetailsLoading, setItemDetailsLoading] = useState(true);
    const [messageDetailVisible, setMessageDetailVisible] = useState(false);
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
            <DisplayBox ref={displayBoxRef}>
                {!roomLoading && (
                <>
                    <ItemBox 
                        width={window.innerWidth}
                        height={window.innerHeight}
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
            >
                    {itemDetailsLoading ? (
                        <div>
                            loading중...
                        </div>
                    ): (
                        <div>
                            <div>
                                messageSender: {messageDetails.message_sender}
                            </div>
                            <div>
                                messageContent: {messageDetails.message_content}
                            </div>
                        </div>
                    )}

            </Modal>
            <Modal
                visible={presentDetailVisible}
                onClose={setPresentDetailVisible}
            >
                    {itemDetailsLoading ? (
                        <div>
                            loading중...
                        </div>
                    ): (
                        <div>
                            <div>
                                presentSender: {presentDetails.present_sender}
                            </div>
                            <div>
                                presentContent: {presentDetails.present_content}
                            </div>
                            <div>
                                presentImgUrl: {presentDetails.present_img_url}
                            </div>
                        </div>
                    )}
            </Modal>
        </ItemEventProvider>
    );
}