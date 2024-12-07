import React, { useState, useRef } from "react";
import { RecipeItem } from "../types";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ItemDetailDialog from "./ItemDetailDialog";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import "./ItemList.css";

interface ItemListPropsC {
  items: RecipeItem[];
  onReorder: (newItems: RecipeItem[]) => void;
  onDelete: (id: string) => void;
}

const ItemListOldC: React.FC<ItemListPropsC> = ({ items, onReorder, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState<RecipeItem | null>(null);

  const handleSelectItem = (item: RecipeItem) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    onReorder(reorderedItems);
  };

  // Swipe to delete logic
  const [swipeData, setSwipeData] = useState<{
    id: string | null;
    startX: number;
    currentX: number;
  }>({ id: null, startX: 0, currentX: 0 });

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setSwipeData({
      id,
      startX: e.touches[0].clientX,
      currentX: e.touches[0].clientX,
    });
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (swipeData.id === id) {
      setSwipeData((prev) => ({ ...prev, currentX: e.touches[0].clientX }));
    }
  };

  const handleTouchEnd = (
    e: React.TouchEvent,
    id: string,
    cardWidth: number
  ) => {
    if (swipeData.id === id) {
      const deltaX = swipeData.startX - swipeData.currentX;
      const threshold = cardWidth * 0.5; // 50% of width
      if (deltaX > threshold) {
        onDelete(id);
      }
      setSwipeData({ id: null, startX: 0, currentX: 0 });
    }
  };

  const getOverlayStyle = (itemId: string, cardWidth: number) => {
    if (swipeData.id !== itemId) {
      return {
        transform: "translateX(0)",
        opacity: 0,
      };
    }
    const deltaX = swipeData.startX - swipeData.currentX;
    const progress = Math.max(0, Math.min(1, deltaX / (cardWidth * 0.5)));
    return {
      transform: `translateX(-${Math.min(deltaX, cardWidth)}px)`,
      opacity: progress,
    };
  };

  return (
    <div className="item-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(dropProvided) => (
            <div
              {...dropProvided.droppableProps}
              ref={dropProvided.innerRef}
              className="droppable-list"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided) => {
                    // We'll store a ref to get the card width
                    const [cardEl, setCardEl] = useState<HTMLDivElement | null>(
                      null
                    );
                    return (
                      <div
                        className="item-wrapper"
                        onTouchStart={(e) => handleTouchStart(e, item.id)}
                        onTouchMove={(e) => handleTouchMove(e, item.id)}
                        onTouchEnd={(e) => {
                          const cardWidth = cardEl?.offsetWidth || 0;
                          handleTouchEnd(e, item.id, cardWidth);
                        }}
                      >
                        <div
                          className="item-swipe-overlay"
                          style={getOverlayStyle(
                            item.id,
                            cardEl?.offsetWidth || 0
                          )}
                        >
                          Delete
                        </div>
                        <Card
                          className="item-card"
                          ref={(el) => {
                            draggableProvided.innerRef(el);
                            setCardEl(el);
                          }}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <div className="item-content">
                            <IconButton size="small" color="primary">
                              <DragIndicatorIcon />
                            </IconButton>
                            <CardMedia
                              component="img"
                              image={item.imageUrl || ""}
                              alt={item.title}
                              className="item-image"
                            />
                            <CardContent style={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1">
                                {item.title}
                              </Typography>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                {item.hasRecipe && (
                                  <RestaurantIcon fontSize="small" />
                                )}
                                <Typography variant="body2">
                                  {item.cookTime} mins
                                </Typography>
                              </div>
                            </CardContent>
                          </div>
                          <div
                            onClick={() => handleSelectItem(item)}
                            className="item-overlay-click"
                          />
                        </Card>
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedItem && (
        <ItemDetailDialog
          item={selectedItem}
          onClose={handleCloseDetail}
          onDelete={() => {
            onDelete(selectedItem.id);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default ItemListOldC;
