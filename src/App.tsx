import styled from 'styled-components';
import { useState, MouseEvent } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { StickyNote } from './components/StickyNote';

interface StickyNoteData {
  id: string;
  x: number;
  y: number;
};
type StickNoteDragItem = Pick<StickyNoteData, "id">;

const StyledApp = styled.div`
  height: 100%;
  box-sizing: border-box;
  background-image: url(${process.env.PUBLIC_URL + '/background.png'});
  background-size: cover;
  position: relative;
  overflow: auto;
`;


export const App = () => {
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([]);
  const handleDrop = (item: StickNoteDragItem, monitor: DropTargetMonitor) => {
    const initialPosition = monitor.getInitialSourceClientOffset();
    const dropPosition = monitor.getSourceClientOffset();

    if (dropPosition?.x && dropPosition?.y && initialPosition?.x && dropPosition.y) {
      const newStickyNotesList = stickyNotes
        .filter(stickyNote => stickyNote.id !== item.id);
      const newStickyNote: StickyNoteData = {
        id: `${dropPosition.x}${dropPosition.y}`,
        x: dropPosition.x,
        y: dropPosition.y
      };

      setStickyNotes([...newStickyNotesList, newStickyNote]);
    }
  };
  const [, drop] = useDrop({
    accept: 'note',
    drop: handleDrop
  });
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const newStickyNote: StickyNoteData = {
      id: `${e.clientX}${e.clientY}`,
      x: e.clientX,
      y: e.clientY
    };

    setStickyNotes([...stickyNotes, newStickyNote]);
  };

  return (
      <StyledApp onClick={(e) => handleClick(e)} ref={drop}>
        {stickyNotes.map(stickyNote => (
          <StickyNote
            key={`${stickyNote.x}${stickyNote.y}`}
            id={`${stickyNote.x}${stickyNote.y}`}
            left={stickyNote.x}
            top={stickyNote.y}
          />
        ))}
      </StyledApp>
  );
}
