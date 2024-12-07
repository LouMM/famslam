import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { RecipeItem } from "../types";

interface ItemDetailDialogProps {
  item: RecipeItem;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ItemDetailDialog: React.FC<ItemDetailDialogProps> = ({
  item,
  onClose,
  onDelete,
}) => {
  const [recipeText, setRecipeText] = useState(item.recipeText || "");

  const handleDelete = () => {
    onDelete(item.id);
    onClose(); // Close the dialog after deletion
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{item.title}</DialogTitle>
      <DialogContent dividers>
        <img
          src={item.imageUrl}
          alt={item.title}
          style={{ width: "100%", borderRadius: "8px", marginBottom: "16px" }}
        />
        <Typography variant="body2" gutterBottom>
          <strong>URL:</strong> {item.url || "N/A"}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Cook Time:</strong> {item.cookTime} mins
        </Typography>
        <TextField
          label="Recipe"
          multiline
          fullWidth
          minRows={4}
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailDialog;
