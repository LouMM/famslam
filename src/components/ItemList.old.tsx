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
import { styled } from "@mui/material/styles";
import ItemDetailDialog from "./ItemDetailDialog";

// Placeholder: Implement drag-and-drop using react-beautiful-dnd or similar
// For simplicity, here we just display the items.

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

const ItemListOld: React.FC<ItemListProps> = ({ items, onReorder, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState<RecipeItem | null>(null);

  const handleSelectItem = (item: RecipeItem) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  return (
    <ItemContainer>
      {items.map((item) => (
        <Card key={item.id} sx={{ borderRadius: "8px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton size="small" color="primary">
              <DragIndicatorIcon />
            </IconButton>
            <CardMedia
              component="img"
              image={item.imageUrl || ""}
              alt={item.title}
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: "8px",
                margin: "8px",
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{item.title}</Typography>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {item.hasRecipe && <RestaurantIcon fontSize="small" />}
                <Typography variant="body2">{item.cookTime} mins</Typography>
              </div>
            </CardContent>
          </div>
          {/* Click area to open detail */}
          <div
            onClick={() => handleSelectItem(item)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              cursor: "pointer",
            }}
          />
        </Card>
      ))}
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
    </ItemContainer>
  );
};

export default ItemListOld;
