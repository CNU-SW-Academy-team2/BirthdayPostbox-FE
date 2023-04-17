import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ItemBox, Title2 } from "../components/domain";
import { Modal } from "../components";

const PageBackground = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
`;

const ContentContainer = styled.div`
`;

const DisplayBox = styled.div`
    display: flex;
    margin: 0 auto;
    min-height: 600px;
    width: 1200px;
    background-color: white;
    text-align: center;
    border-radius: 16px;
    box-sizing: border-box;
    box-shadow: 6.79014px 6.79014px 20.3704px 5.43212px rgba(0, 0, 0, 0.14);
    justify-content: space-evenly;
`;


export default function Congratulation() {
    const { room_id, owner_code } = useParams();
    const navigate = useNavigate();

    const [roomLoading, setRoomLoading] = useState(true);
    const [itemDetailsLoading, setItemDetailsLoading] = useState(true);
    const [messageDetailVisible, setMessageDetailVisible] = useState(false);
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
        messages: [],
        presents: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/room-content`, {
                    params: {
                        room_id
                    }
                });

                if (res.status === 200) {
                    setRoomData(res.data);
                    setRoomLoading(false);
                }
                else {
                    throw new Error('방 정보를 불러올 수 없습니다.');
                }

            } catch (e) {
                console.error(e);
            }
        }
        setRoomLoading(true);
        fetchData();
    }, [room_id]);

    const handleSelectMessage = async (id) => {
        setItemDetailsLoading(true);
        setMessageDetailVisible(true);
        try {
            const res = await axios.get('/message', {
                params: {
                    id,
                    owner_code
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
                    owner_code
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
        <PageBackground>
            <ContentContainer>
                <Title2 />
                <DisplayBox>
                    {!roomLoading && (
                    <>
                        <ItemBox 
                            width={1200}
                            height={720}
                            style={{ justifyContent: "end" }}
                            messages={roomData.messages}
                            presents={roomData.presents}
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
            </ContentContainer>
        </PageBackground>
    );
}