import React, { useState, TouchEvent } from "react";
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
import { styled } from "@mui/material/styles";
import ItemDetailDialog from "./ItemDetailDialog";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import "./ItemList.css";

const [swipeData, setSwipeData] = useState<{
  id: string | null;
  startX: number;
  currentX: number;
}>({ id: null, startX: 0, currentX: 0 });

const ItemContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));
interface ItemListProps {
  items: RecipeItem[];
  onReorder: (newItems: RecipeItem[]) => void;
  onDelete: (id: string) => void;
}

const ItemListOldb: React.FC<ItemListProps> = ({ items, onReorder, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState<RecipeItem | null>(null);

  const handleSelectItem = (item: RecipeItem) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  // Drag and drop handlers
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    onReorder(reorderedItems);
  };

  // Swipe to delete logic
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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
    itemWidth: number
  ) => {
    if (swipeData.id === id) {
      const deltaX = swipeData.startX - swipeData.currentX;
      const threshold = itemWidth * 0.5; // 50% of width
      if (deltaX > threshold) {
        onDelete(id);
      }
      // Reset swipe
      setSwipeData({ id: null, startX: 0, currentX: 0 });
    }
  };

  return (
    <div className="item-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="droppable-list"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided) => (
                    <Card
                      className="item-card"
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      onTouchStart={(e) => handleTouchStart(e, item.id)}
                      onTouchMove={(e) => handleTouchMove(e, item.id)}
                      onTouchEnd={(e) => {
                       }}
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
                      {/* Click area to open detail */}
                      <div
                        onClick={() => handleSelectItem(item)}
                        className="item-overlay-click"
                      />
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
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

export default ItemListOldb;
