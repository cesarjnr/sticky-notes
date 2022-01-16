import styled from "styled-components";
import { useState, ChangeEvent } from "react";
import { useDrag } from 'react-dnd';
import { AiFillDelete } from 'react-icons/ai';
import { CgColorPicker } from 'react-icons/cg';
import { HexColorPicker } from "react-colorful";

export interface StickyNoteProps {
  id: string;
  text: string;
  position: {
    x: number;
    y: number;
  };
  onDelete: (id: string) => void;
  backgroundColor?: string;
};
export type StickyNoteListItem = Omit<StickyNoteProps, "onDelete"> & {
  backgroundColor?: string;
};
type StyledStickyNoteProps = Pick<StickyNoteProps, "position"> & {
  backgroundColor: string;
};

export const STICKY_NOTE_WIDTH = 230;
export const STICKY_NOTE_HEIGHT = 300;

const StyledStickyNote = styled.div`
  box-sizing: border-box;
  position: absolute;
  padding: 15px;
  width: 230px;
  height: 300px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  background-color: ${(props: StyledStickyNoteProps) => props.backgroundColor};
  left: ${(props: StyledStickyNoteProps) => props.position.x}px;
  top: ${(props: StyledStickyNoteProps) => props.position.y}px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &:before {
    content: "";
    background-image: url(${process.env.PUBLIC_URL + '/pin.png'});
    background-size: cover;
    width: 30px;
    height: 30px;
    position: absolute;
    top: -15px;
    left: 100px;
  }
`;
const Menu = styled.div`
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid rgb(96,96,96);
`;
const ButtonIcon = styled.button`
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
  onDelete,
  backgroundColor
}: StickyNoteProps) => {
  const [inputValue, setInputValue] = useState(text);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(backgroundColor || '#8aaee8');
  const [, drag] = useDrag({
    type: 'note',
    item: () => ({
      id,
      text: inputValue,
      backgroundColor: selectedBackgroundColor
    })
  });
  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  };
  const handleColorPickerChange = (newColor: string): void => {
    setSelectedBackgroundColor(newColor);
    setShowColorPicker(!showColorPicker);
  };

  return (
    <StyledStickyNote
      position={position}
      backgroundColor={selectedBackgroundColor}
      ref={drag}
    >
      <Menu>
        <ButtonIcon onClick={() => setShowColorPicker(!showColorPicker)}>
          <CgColorPicker color="rgb(96,96,96)" size="1.3em" />
        </ButtonIcon>
        <ButtonIcon onClick={() => onDelete(id)}>
          <AiFillDelete color="rgb(96,96,96)" size="1.3em" />
        </ButtonIcon>
      </Menu>

      <TextArea
        value={inputValue}
        maxLength={336}
        onChange={handleTextAreaChange}
        autoFocus
      />

      {showColorPicker && (
        <HexColorPicker
          color={selectedBackgroundColor}
          onChange={handleColorPickerChange}
        />
      )}
    </StyledStickyNote>
  );
};
