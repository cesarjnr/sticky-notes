import styled from 'styled-components';
import { useEffect, MouseEvent } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { useCanvas, CanvasItem } from '../../hooks/useCanvas';

import {
  StickyNote,
  StickyNoteListItem,
  STICKY_NOTE_WIDTH,
  STICKY_NOTE_HEIGHT
} from './StickyNote';


interface StickyNoteDragItem {
  id: string;
  text: string;
  backgroundColor: string;
};
interface StyledCanvasProps {
  width: number;
  height: number;
};

const StyledCanvas = styled.div`
  box-sizing: border-box;
  background-image: url(${process.env.PUBLIC_URL + '/background.png'});
  background-size: cover;
  display: flex;
  flex-direction: column;
  width: ${(props: StyledCanvasProps) => props.width}px;
  height: ${(props: StyledCanvasProps) => props.height}px;
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
  const persistedStickyNotes = localStorage.getItem('stickyNotes');
  const {
    items,
    canvasWidth,
    canvasHeight,
    insertItemOnCanvas,
    removeItemFromCanvas,
    clearCanvas
  } = useCanvas(persistedStickyNotes ? JSON.parse(persistedStickyNotes) : []);
  const [, drop] = useDrop({
    accept: 'note',
    canDrop: (item, monitor) => monitor.isOver({ shallow: true }),
    drop: (item: StickyNoteDragItem, monitor: DropTargetMonitor) => {
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
            x: dropPosition.x,
            y: dropPosition.y
          },
          backgroundColor: item.backgroundColor
        };
  
        setStickyNotes([...newStickyNotesList, newStickyNote]);
      }
    },
  });
  const handleCanvasClick = (e: MouseEvent<HTMLElement>) => {
    const element = (e.target as HTMLDivElement);
    const hasCanvasBodyClass = element.classList.contains('canvasBody');

    if (hasCanvasBodyClass) {
      const newStickyNote: CanvasItem = {
        id: `${e.pageX}${e.pageY}`,
        size: {
          width: STICKY_NOTE_WIDTH,
          height: STICKY_NOTE_HEIGHT
        },
        position: {
          x: e.pageX,
          y: e.pageY
        },
        data: {
          text: ''
        }
      };
  
      insertItemOnCanvas(newStickyNote);
    }
  };

  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('canvasWidth', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('canvasHeight', JSON.stringify(items));
  }, [items]);

  return (
    <StyledCanvas width={canvasWidth} height={canvasHeight}>
      <CanvasMenu>
        <ClearButton onClick={clearCanvas}>Clear</ClearButton>
      </CanvasMenu>
      <CanvasBody
        ref={drop}
        onClick={handleCanvasClick}
        className="canvasBody"
      >
        {items.map(item => (
          <StickyNote
            key={item.id}
            id={item.id}
            text={item.data.text}
            position={item.position}
            onDelete={() => removeItemFromCanvas(item.id)}
            backgroundColor={item.data.backgroundColor}
          />
        ))}
      </CanvasBody>
    </StyledCanvas>
  );
}
