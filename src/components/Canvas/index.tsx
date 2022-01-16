import styled from 'styled-components';
import { MouseEvent } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { useCanvas, CanvasItem } from '../../hooks/useCanvas';
import {
  StickyNote,
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
  const {
    items,
    canvasWidth,
    canvasHeight,
    insertItemOnCanvas,
    moveItemOverCanvas,
    removeItemFromCanvas,
    clearCanvas
  } = useCanvas([]);
  const [, drop] = useDrop({
    accept: 'note',
    canDrop: (_item, monitor) => monitor.isOver({ shallow: true }),
    drop: (item: StickyNoteDragItem, monitor: DropTargetMonitor) => {
      const initialPosition = monitor.getInitialSourceClientOffset();
      const dropPosition = monitor.getSourceClientOffset();
  
      if (dropPosition?.x && dropPosition?.y && initialPosition?.x && dropPosition.y) {
        moveItemOverCanvas(item.id, { x: dropPosition.x, y: dropPosition.y });
      }
    },
  });
  const handleCanvasClick = (e: MouseEvent<HTMLElement>) => {
    const element = (e.target as HTMLDivElement);
    const hasCanvasBodyClass = element.classList.contains('canvasBody');

    if (hasCanvasBodyClass) {
      const newStickyNote: CanvasItem = {
        id: `${items.length + 1}`,
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
