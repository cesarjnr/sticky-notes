import styled from 'styled-components';
import { useState, MouseEvent } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { StickyNote, StickyNoteProps, STICKY_NOTE_WIDTH, STICKY_NOTE_HEIGHT } from './StickyNote';

type StickyNoteListItem = Omit<StickyNoteProps, "onDelete"> & {
  backgroundColor?: string;
};
interface StickyNoteDragItem {
  id: string;
  text: string;
  backgroundColor: string;
};
interface StyledAppProps {
  width: number;
  height: number;
};

const StyledCanvas = styled.div`
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

export const Canvas = () => {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  const [stickyNotes, setStickyNotes] = useState<StickyNoteListItem[]>([]);
  const handleDrop = (item: StickyNoteDragItem, monitor: DropTargetMonitor) => {
    const initialPosition = monitor.getInitialSourceClientOffset();
    const dropPosition = monitor.getSourceClientOffset();

    if (dropPosition?.x && dropPosition?.y && initialPosition?.x && dropPosition.y) {
      if (dropPosition.x > canvasWidth - STICKY_NOTE_WIDTH) {
        setCanvasWidth(canvasWidth + STICKY_NOTE_WIDTH);
      }
  
      if (dropPosition.y > canvasHeight - STICKY_NOTE_HEIGHT) {
        setCanvasHeight(canvasHeight + STICKY_NOTE_HEIGHT);
      }

      const newStickyNotesList = stickyNotes
        .filter(stickyNote => stickyNote.id !== item.id);
      const newStickyNote: StickyNoteListItem = {
        id: `${dropPosition.x}${dropPosition.y}`,
        text: item.text,
        position: {
          left: dropPosition.x,
          top: dropPosition.y
        },
        backgroundColor: item.backgroundColor
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
  const handleCanvasClick = (e: MouseEvent<HTMLElement>) => {
    const element = (e.target as HTMLDivElement);
    const hasCanvasBodyClass = element.classList.contains('canvasBody');

    if (hasCanvasBodyClass) {
      if (e.pageX > canvasWidth - STICKY_NOTE_WIDTH) {
        setCanvasWidth(canvasWidth + STICKY_NOTE_WIDTH);
      }
  
      if (e.pageY > canvasHeight - STICKY_NOTE_HEIGHT) {
        setCanvasHeight(canvasHeight + STICKY_NOTE_HEIGHT);
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
    }
  };
  const handleDeleteButtonClick = (id: string) => {
    const filteredStickyNotes = stickyNotes.filter(stickyNote => stickyNote.id !== id);
    const highestPosition = filteredStickyNotes.reduce((previousPosition, currentStickyNote) => {
      const { position: { left, top } } = currentStickyNote;

      if (left > previousPosition.x && top > previousPosition.y) {
        return ({ x: left, y: top });
      } else {
        return previousPosition;
      }
    }, { x: 0, y: 0 });

    setStickyNotes(filteredStickyNotes);

    if (highestPosition.x < window.innerWidth) {
      setCanvasWidth(window.innerWidth);
    }
    
    if (highestPosition.y < window.innerHeight) {
      setCanvasHeight(window.innerHeight);
    }

  };
  const handleClearButtonClick = () => {
    setStickyNotes([]);
    setCanvasWidth(window.innerWidth);
    setCanvasHeight(window.innerHeight);
  };

  return (
    <StyledCanvas width={canvasWidth} height={canvasHeight}>
      <CanvasMenu>
        <ClearButton onClick={handleClearButtonClick}>Clear</ClearButton>
      </CanvasMenu>
      <CanvasBody
        ref={drop}
        onClick={handleCanvasClick}
        className="canvasBody"
      >
        {stickyNotes.map(stickyNote => (
          <StickyNote
            key={stickyNote.id}
            id={stickyNote.id}
            text={stickyNote.text}
            position={stickyNote.position}
            onDelete={handleDeleteButtonClick}
            backgroundColor={stickyNote.backgroundColor}
          />
        ))}
      </CanvasBody>
    </StyledCanvas>
  );
}
