import styled from 'styled-components';
import { useState, MouseEvent } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { StickyNote, StyledStickyNoteProps } from './components/StickyNote';

type StickyNoteListItem = Omit<StyledStickyNoteProps, "onDelete">;

interface StickyNoteDragItem {
  id: string;
  text: string;
};

interface StyledAppProps {
  width: number;
  height: number;
};

const StyledApp = styled.div`
  box-sizing: border-box;
  background-image: url(${process.env.PUBLIC_URL + '/background.png'});
  background-size: cover;
  display: flex;
  flex-direction: column;
  width: ${(props: StyledAppProps) => props.width}px;
  height: ${(props: StyledAppProps) => props.height}px;
`;
const CanvasMenu = styled.div`
  box-sizing: border-box;
  width: 100%;
  background-color: rgb(0, 0, 0, 0.3);
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  z-index: 1;
`;
const CanvasBody = styled.div`
  flex-grow: 1;
  margin: 25px;
`;
const ClearButton = styled.button`
  width: 70px;
  border: 0;
  background-color: #87eabf;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #69e4ae;
  }
`;

export const App = () => {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  const [stickyNotes, setStickyNotes] = useState<StickyNoteListItem[]>([]);
  const handleDrop = (item: StickyNoteDragItem, monitor: DropTargetMonitor) => {
    const initialPosition = monitor.getInitialSourceClientOffset();
    const dropPosition = monitor.getSourceClientOffset();

    if (dropPosition?.x && dropPosition?.y && initialPosition?.x && dropPosition.y) {
      const newStickyNotesList = stickyNotes
        .filter(stickyNote => stickyNote.id !== item.id);
      const newStickyNote: StickyNoteListItem = {
        id: `${dropPosition.x}${dropPosition.y}`,
        text: item.text,
        position: {
          left: dropPosition.x,
          top: dropPosition.y
        }
      };

      setStickyNotes([...newStickyNotesList, newStickyNote]);
    }
  };
  const [, drop] = useDrop({
    accept: 'note',
    drop: handleDrop,
    canDrop: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        return true;
      } else {
        return false;
      }
    }
  });
  const handleCanvasClick = (e: MouseEvent<HTMLElement>) => {;
    const stickyNoteWidth = 200;
    const stickyNoteHeight = 270;

    if (e.pageX > canvasWidth - stickyNoteWidth) {
      setCanvasWidth(canvasWidth + stickyNoteWidth);
    }

    if (e.pageY > canvasHeight - stickyNoteHeight) {
      setCanvasHeight(canvasHeight + stickyNoteHeight);
    }

    const newStickyNote: StickyNoteListItem = {
      id: `${e.pageX}${e.pageY}`,
      text: '',
      position: {
        left: e.pageX,
        top: e.pageY
      },
    };

    setStickyNotes([...stickyNotes, newStickyNote]);
  };
  const handleDeleteButtonClick = (id: string) => {
    const filteredStickyNotes = stickyNotes.filter(stickyNote => stickyNote.id !== id);

    setStickyNotes(filteredStickyNotes);
  };
  const handleClearButtonClick = () => {
    setStickyNotes([]);
  };

  return (
    <StyledApp
      width={canvasWidth}
      height={canvasHeight}
    >
      <CanvasMenu>
        <ClearButton onClick={handleClearButtonClick}>Clear</ClearButton>
      </CanvasMenu>
      <CanvasBody ref={drop} onClick={handleCanvasClick}>
        {stickyNotes.map(stickyNote => (
          <StickyNote
            key={stickyNote.id}
            id={stickyNote.id}
            text={stickyNote.text}
            position={stickyNote.position}
            onDelete={handleDeleteButtonClick}
          />
        ))}
      </CanvasBody>
    </StyledApp>
  );
}
