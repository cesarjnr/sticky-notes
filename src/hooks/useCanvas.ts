import { useState } from 'react';

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
  insertItemOnCanvas: (item: CanvasItem) => void,
  removeItemFromCanvas: (id: string) => void,
  clearCanvas: () => void
}

export const useCanvas = (initialItems: CanvasItem[]): UseCanvas => {
  const persistedCanvasWidth = localStorage.getItem('canvasWidth');
  const persistedCanvasHeight = localStorage.getItem('canvasHeight');
  const [canvasWidth, setCanvasWidth] = useState(persistedCanvasWidth ? Number(persistedCanvasWidth) : window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(persistedCanvasHeight ? Number(persistedCanvasHeight) : window.innerHeight);
  const [items, setItems] = useState<CanvasItem[]>(initialItems);
  const expandCanvas = (itemPosition: ItemPosition, itemSize: ItemSize) => {
    if (itemPosition.x > canvasWidth - itemSize.width) {
      setCanvasWidth(canvasWidth + itemSize.width);
    }
    if (itemPosition.y > canvasHeight - itemSize.height) {
      setCanvasHeight(canvasHeight + itemSize.height);
    }
  };
  const insertItemOnCanvas = (item: CanvasItem) => {
    expandCanvas(item.position, item.size);
    setItems([...items, item]);
  };
  const removeItemFromCanvas = (id: string) => {
    const itemsWithoutRemovedItem = items.filter(item => item.id !== id);
    const itemOnHighestPosition = itemsWithoutRemovedItem.reduce((previousItem, currentItem) => {
      if (
        currentItem.position.x > previousItem.position.x &&
        currentItem.position.y > previousItem.position.y
      ) {
        return currentItem;
      } else {
        return previousItem;
      }
    });

    setItems(itemsWithoutRemovedItem);

    if (itemOnHighestPosition.position.x < window.innerWidth) {
      setCanvasWidth(window.innerWidth);
    }
    if (itemOnHighestPosition.position.y < window.innerHeight) {
      setCanvasHeight(window.innerHeight);
    }
  };
  const clearCanvas = () => {
    setItems([]);
    setCanvasWidth(window.innerWidth);
    setCanvasHeight(window.innerHeight);
  };

  return {
    items,
    canvasWidth,
    canvasHeight,
    insertItemOnCanvas,
    removeItemFromCanvas,
    clearCanvas
  };
};
