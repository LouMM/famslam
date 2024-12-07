import React, { useState } from "react";
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
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ItemDetailDialog from "./ItemDetailDialog";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import "./ItemList.css";

interface ItemListProps {
  items: RecipeItem[];
  onReorder: (newItems: RecipeItem[]) => void;
  onDelete: (id: string) => void;
  errorMessages: string[];
  clearErrors: () => void;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  onReorder,
  onDelete,
  errorMessages,
  clearErrors,
}) => {
  const [selectedItem, setSelectedItem] = useState<RecipeItem | null>(null);
  const [cardEl, setCardEl] = useState<HTMLDivElement | null>(null);
  const [errorPaneVisible, setErrorPaneVisible] = useState(true);

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

  // Swipe logic for delete (unchanged)
  const [swipeData, setSwipeData] = useState<{
    id: string | null;
    startX: number;
    currentX: number;
    swiping: boolean;
  }>({ id: null, startX: 0, currentX: 0, swiping: false });

  const startSwipe = (x: number, id: string) => {
    setSwipeData({ id, startX: x, currentX: x, swiping: true });
  };

  const moveSwipe = (x: number, id: string) => {
    if (swipeData.id === id && swipeData.swiping) {
      setSwipeData((prev) => ({ ...prev, currentX: x }));
    }
  };

  const endSwipe = (id: string, cardWidth: number) => {
    if (swipeData.id === id && swipeData.swiping) {
      const deltaX = swipeData.startX - swipeData.currentX;
      const threshold = cardWidth * 0.75;
      if (deltaX > threshold) {
        onDelete(id);
      }
      setSwipeData({ id: null, startX: 0, currentX: 0, swiping: false });
    }
  };

  const getOverlayStyle = (itemId: string, cardWidth: number) => {
    if (swipeData.id !== itemId || !swipeData.swiping) {
      return {
        transform: "translateX(0)",
        opacity: 0,
      };
    }
    const deltaX = swipeData.startX - swipeData.currentX;
    const progress = Math.max(0, Math.min(1, deltaX / (cardWidth * 0.75)));
    return {
      transform: `translateX(-${Math.min(deltaX, cardWidth)}px)`,
      opacity: progress,
    };
  };

  const shouldShowDeleteText = (itemId: string, cardWidth: number) => {
    if (swipeData.id !== itemId || !swipeData.swiping) return false;
    const deltaX = swipeData.startX - swipeData.currentX;
    return deltaX > cardWidth * 0.75;
  };

  // Mouse events for swipe
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    startSwipe(e.clientX, id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    if (swipeData.swiping && swipeData.id === id) {
      moveSwipe(e.clientX, id);
    }
  };

  const handleMouseUp = (id: string, cardWidth: number) => {
    endSwipe(id, cardWidth);
  };

  // Touch events for swipe
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    id: string
  ) => {
    startSwipe(e.touches[0].clientX, id);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, id: string) => {
    moveSwipe(e.touches[0].clientX, id);
  };

  const handleTouchEnd = (id: string, cardWidth: number) => {
    endSwipe(id, cardWidth);
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
              {items.map((item, index) => {
                const tagCount = item.tags ? item.tags.length : 0;
                const tagLabel = tagCount > 0 ? `(${tagCount})` : "";
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                      <div
                        ref={(el) => {
                          draggableProvided.innerRef(el);
                          setCardEl(el);
                        }}
                        {...draggableProvided.draggableProps}
                      >
                        <Card
                          className={`item-card ${
                            draggableSnapshot.isDragging ? "dragging" : ""
                          }`}
                          style={{ touchAction: "none", position: "relative" }}
                        >
                          <div
                            className="item-swipe-overlay"
                            style={getOverlayStyle(
                              item.id,
                              cardEl?.offsetWidth || 0
                            )}
                          >
                            {shouldShowDeleteText(
                              item.id,
                              cardEl?.offsetWidth || 0
                            )
                              ? "Delete Item"
                              : ""}
                          </div>
                          <div
                            className="item-content"
                            {...draggableProvided.dragHandleProps}
                          >
                            <IconButton size="small" color="primary">
                              <DragIndicatorIcon />
                            </IconButton>
                            <CardMedia
                              component="img"
                              image={item.imageUrl || ""}
                              alt={item.title}
                              className="item-image"
                              onClick={() => handleSelectItem(item)}
                            />
                            <CardContent
                              className="item-text-content"
                              onClick={() => handleSelectItem(item)}
                            >
                              <Typography variant="subtitle1">
                                {item.title}
                              </Typography>
                              <div className="item-recipe-info">
                                {item.hasRecipe && (
                                  <RestaurantIcon fontSize="small" />
                                )}
                                <Typography variant="body2">
                                  {item.cookTime} mins
                                </Typography>
                              </div>
                            </CardContent>
                            {tagCount > 0 && (
                              <div className="item-tags">
                                <LocalOfferIcon fontSize="small" />
                                <Typography variant="body2">
                                  {tagLabel}
                                </Typography>
                              </div>
                            )}
                          </div>
                          <div
                            className="item-overlay-click"
                            // Touch events
                            onTouchStart={(e) => handleTouchStart(e, item.id)}
                            onTouchMove={(e) => handleTouchMove(e, item.id)}
                            onTouchEnd={() =>
                              handleTouchEnd(item.id, cardEl?.offsetWidth || 0)
                            }
                            // Mouse events
                            onMouseDown={(e) => handleMouseDown(e, item.id)}
                            onMouseMove={(e) => handleMouseMove(e, item.id)}
                            onMouseUp={() =>
                              handleMouseUp(item.id, cardEl?.offsetWidth || 0)
                            }
                          />
                        </Card>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedItem && (
        <ItemDetailDialog
          item={selectedItem}
          onClose={handleCloseDetail}
          onDelete={(id) => {
            onDelete(id);
            handleCloseDetail(); // Close after delete
          }}
        />
      )}

      {errorPaneVisible && errorMessages.length > 0 && (
        <div className="error-pane">
          <div className="error-pane-header">
            <strong>Error Messages</strong>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setErrorPaneVisible(false)}
                style={{ cursor: "pointer" }}
              >
                X
              </button>
              <button
                onClick={() => clearErrors()}
                style={{ cursor: "pointer" }}
              >
                Clear
              </button>
            </div>
          </div>
          {errorMessages.map((msg, idx) => (
            <div key={idx} className="error-message">
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;
