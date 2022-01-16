import { useState, useLayoutEffect, useCallback } from 'react';

interface ItemSize {
  width: number;
  height: number;
};
interface ItemPosition {
  x: number;
  y: number;
}
export interface CanvasItem {
  id: string;
  size: ItemSize;
  position: ItemPosition;
  data: {
    [key: string]: any;
  };
}
interface UseCanvas {
  items: CanvasItem[];
  canvasWidth: number;
  canvasHeight: number;
  insertItemOnCanvas: (item: CanvasItem) => void;
  moveItemOverCanvas: (id: string, newPosition: ItemPosition) => void;
  removeItemFromCanvas: (id: string) => void;
  clearCanvas: () => void;
}

export const useCanvas = (initialItems: CanvasItem[]): UseCanvas => {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  const [items, setItems] = useState<CanvasItem[]>(initialItems);
  const insertItemOnCanvas = (item: CanvasItem) => {
    setItems([...items, item]);
  };
  const moveItemOverCanvas = (id: string, newPosition: ItemPosition) => {
    const itemIndex = items.findIndex(item => item.id === id);

    items[itemIndex].position = newPosition;
    setItems([...items]);
  };
  const removeItemFromCanvas = (id: string) => {
    const itemsWithoutRemovedItem = items.filter(item => item.id !== id);

    setItems(itemsWithoutRemovedItem);
  };
  const clearCanvas = () => {
    setItems([]);
  };
  const adjustCanvasSize = useCallback(() => {
    if (items.length) {
      const highestPosition = items.reduce((highestPosition, currentItem) => {
        if (currentItem.position.x > highestPosition.x) {
          highestPosition.x = currentItem.position.x;
        }
  
        if (currentItem.position.y > highestPosition.y) {
          highestPosition.y = currentItem.position.y;
        }
  
        return highestPosition;
      }, { x: 0, y: 0 });

      const itemSize = items[0].size;
      const marginOnAdjust = 20;

      if ((highestPosition.x + itemSize.width) > canvasWidth) {
        setCanvasWidth(highestPosition.x + itemSize.width + marginOnAdjust);
      }

      if ((highestPosition.y + itemSize.height) > canvasHeight) {
        setCanvasHeight(highestPosition.y + itemSize.height + marginOnAdjust);
      }
    } else {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
    }
  }, [items, canvasWidth, canvasHeight]);

  useLayoutEffect(() => {
    adjustCanvasSize();
  }, [adjustCanvasSize]);

  return {
    items,
    canvasWidth,
    canvasHeight,
    insertItemOnCanvas,
    moveItemOverCanvas,
    removeItemFromCanvas,
    clearCanvas
  };
};
