import styled from "styled-components";
import { useState, ChangeEvent } from "react";
import { useDrag } from 'react-dnd';
import { AiFillDelete } from 'react-icons/ai';

export interface StyledStickyNoteProps {
  id: string;
  text: string;
  position: {
    left: number;
    top: number;
  };
  onDelete: (id: string) => void;
};

const StyledStickyNote = styled.div`
  box-sizing: border-box;
  position: absolute;
  padding: 15px;
  background-color: #8aaee8;
  height: 270px;
  width: 200px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  left: ${(props: Pick<StyledStickyNoteProps, "position">) => props.position.left}px;
  top: ${(props: Pick<StyledStickyNoteProps, "position">) => props.position.top}px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  &:before {
    content: "";
    background-image: url(${process.env.PUBLIC_URL + '/pin.png'});
    background-size: cover;
    width: 30px;
    height: 30px;
    position: absolute;
    top: -15px;
    left: 85px;
  }
`;
const DeleteButton = styled.button`
  border: 0;
  border-radius: 50%;
  padding: 10px;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: rgba(96, 96, 96, 0.1);
  }
`;
const TextArea = styled.textarea`
  box-sizing: border-box;
  background-color: inherit;
  border: none;
  resize: none;
  height: 100%;

  &:focus-visible {
    outline: 0;
  }
`;

export const StickyNote = ({
  id,
  text,
  position,
  onDelete
}: StyledStickyNoteProps) => {
  const [inputValue, setInputValue] = useState(text);
  const [, drag] = useDrag({
    type: 'note',
    item: () => ({ id, text: inputValue })
  });
  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  const handleTextAreFocus = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.value = '';
    e.target.value = inputValue;
  }; // This is necessary to initialize the cursor at the end of the input when moving the note

  return (
    <StyledStickyNote
      position={position}
      ref={drag}
    >
      <DeleteButton onClick={() => onDelete(id)}>
        <AiFillDelete color="rgb(96,96,96)" size="1.3em" />
      </DeleteButton>
      <TextArea
        value={inputValue}
        maxLength={273}
        onChange={handleTextAreaChange}
        onFocus={handleTextAreFocus}
        autoFocus
      />
    </StyledStickyNote>
  );
};
