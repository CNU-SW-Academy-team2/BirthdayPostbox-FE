import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageList, PresentList, Title2 } from "../components/domain";
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
    const { roomId } = useParams();
    const [roomLoading, setRoomLoading] = useState(true);
    const [itemDetailsLoading, setItemDetailsLoading] = useState(true);
    const [messageDetailVisible, setMessageDetailVisible] = useState(false);
    const [messageDetails, setMessageDetail] = useState({
        messageId: null,
        messageSender: "",
        messageContent: ""
    });

    const [presentDetailVisible, setPresentDetailVisible] = useState(false);
    const [presentDetails, setPresentDetails] = useState({
        presentId: null,
        presentSender: "",
        presentContent: "",
        presentImgUrl: ""
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
                        room_id: roomId
                    }
                });

                if (res.status === 200) {
                    setRoomData(res.data);
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
        setRoomLoading(false);
    }, [roomId]);

    const fetchMessage = async (id) => {
        try {
            const res = await axios.get('/message', {
                params: {
                    id
                }
            });

            if (res.status === 200) {
                return res.data;
            }
            else {
                throw new Error("선물 상세 확인 API 오류");
            }

        } catch (e) {
            console.error(e);
        }
    }

    const fetchPresent = async (id) => {
        try {
            const res = await axios.get('/present', {
                params: {
                    id
                }
            });
            if (res.status === 200) {
                return res.data;
            }
            else {
                throw new Error("선물 상세 확인 API 오류");
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleClickMessage = async (id) => {
        setItemDetailsLoading(true);
        setMessageDetailVisible(true);
        const messageDetails = await fetchMessage(id);
        setMessageDetail(messageDetails);
        setItemDetailsLoading(false);
    }

    const handleClickPresent = async (id) => {
        setItemDetailsLoading(true);
        setPresentDetailVisible(true);
        const presentDetails = await fetchPresent(id);
        setPresentDetails(presentDetails);
        setItemDetailsLoading(false);
    }

    return (
        <PageBackground>
            <ContentContainer>
                <Title2 />
                <DisplayBox>
                    {!roomLoading && (
                    <>
                        <PresentList presents={roomData.presents} onClick={handleClickPresent} />
                        <MessageList messages={roomData.messages} onClick={handleClickMessage} />
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
                                    messageSender: {messageDetails.messageSender}
                                </div>
                                <div>
                                    messageContent: {messageDetails.messageContent}
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
                                    presentSender: {presentDetails.presentSender}
                                </div>
                                <div>
                                    presentContent: {presentDetails.presentContent}
                                </div>
                                <div>
                                    presentImgUrl: {presentDetails.presentImgUrl}
                                </div>
                            </div>
                        )}
                </Modal>
            </ContentContainer>
        </PageBackground>
    );
}