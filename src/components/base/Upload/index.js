import styled from "@emotion/styled";
import { useRef, useState } from "react";

const UploadContainer = styled.div`
    display: inline-block;
    cursor: pointer;
`;

const Input = styled.input`
    display: none;
`;

const Upload = ({ children, droppable, name, accept, value, onChange, ...props}) => {
    const [file, setFile] = useState(value);
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const handleFileChange = (e) => {
        const files = e.target.files;
        const changedFile = files[0];
        setFile(changedFile);
        onChange && onChange(changedFile);
    };

    const handleChooseFile = () => {
        inputRef.current.click();
    };

    const handleDragEnter = (e) => {
        if (!droppable) return;

        e.preventDefault();
        e.stopPropagation();    // 부모나 자식 컴포넌트로 이벤트가 전파되는 것을 막음

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    };
    const handleDrageLeave = (e) => {
        if (!droppable) return;

        e.preventDefault();
        e.stopPropagation();

        setDragging(false);
    };
    const handelDragOver = (e) => {
        if (!droppable) return;

        e.preventDefault();
        e.stopPropagation();
    };
    const handleFileDrop = (e) => {
        if (!droppable) return;

        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        const changeFile = files[0];
        setFile(changeFile);
        onChange && onChange(changeFile);
        setDragging(false);
    };

    return (
        <UploadContainer onClick={handleChooseFile} 
        onDrop={handleFileDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDrageLeave}
        onDragOver={handelDragOver}
        {...props}>
            <Input ref={inputRef} type="file" name={name} accept={accept} onChange={handleFileChange} />
            {typeof children === 'function' ? children(file, dragging) : children}
        </UploadContainer>
    );
};

export default Upload;