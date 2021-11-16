import styled from "styled-components";
import { useDrag } from 'react-dnd';

interface StyledStickyNoteProps {
  id: string;
  left: number;
  top: number;
};

const StyledStickyNote = styled.div`
  box-sizing: border-box;
  padding: 20px 10px 10px 10px;
  background-color: #8aaee8;
  height: 270px;
  width: 200px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  position: absolute;
  left: ${(props: Omit<StyledStickyNoteProps, "id">) => props.left}px;
  top: ${(props: Omit<StyledStickyNoteProps, "id">) => props.top}px;
`;
const StyledPin = styled.img`
  width: 120px;
  height: 62px;
  position: absolute;
  left: 30px;
  top: -25px;
`;
const StyledTextArea = styled.textarea`
  box-sizing: border-box;
  background-color: inherit;
  border: none;
  resize: none;
  height: 100%;

  &:focus-visible {
    outline: 0;
  }
`;

export const StickyNote = ({ id, left, top }: StyledStickyNoteProps) => {
  const [, drag] = useDrag({
    type: 'note',
    item: { id }
  });

  return (
    <StyledStickyNote
      left={left}
      top={top}
      ref={drag}
    >
      <StyledPin
        src={process.env.PUBLIC_URL + "/pin.png"}
        alt="pin"
        draggable="false"
      />
      <StyledTextArea maxLength={315} />
    </StyledStickyNote>
  );
};
