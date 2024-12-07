import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { RecipeItem } from "../types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LinkIcon from "@mui/icons-material/Link";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import "./ItemDetailDialog.css";

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
  const [tags, setTags] = useState(item.tags || []); // Assume tags array is stored in item
  // If item.tags doesn't exist yet, we must also handle this in ItemList or App when adding items.

  const handleDelete = () => {
    // Save changes before delete if needed (not specified, but recipe is updated on close anyway)
    onDelete(item.id);
    onClose(); // Close the dialog after deletion
  };

  const handleSave = () => {
    // On close, we should save the updated recipeText and tags back to the item
    item.recipeText = recipeText;
    item.tags = tags;
    onClose();
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    const newTags = val
      ? val
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];
    setTags(newTags);
  };

  const tagString = tags.join(", ");

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{item.title}</DialogTitle>
      <DialogContent dividers>
        <img
          src={item.imageUrl}
          alt={item.title}
          className="item-detail-image"
        />

        <div className="item-detail-field">
          <LinkIcon className="item-detail-icon" />
          <Typography variant="body2">
            <strong>URL:</strong>
          </Typography>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url}
            </a>
          ) : (
            <Typography variant="body2">N/A</Typography>
          )}
        </div>

        <div className="item-detail-field">
          <AvTimerIcon className="item-detail-icon" />
          <Typography variant="body2">
            <strong>Cook Time:</strong> {item.cookTime} mins
          </Typography>
        </div>

        <div className="item-detail-field">
          <RamenDiningIcon className="item-detail-icon" />
          <Typography variant="body2">
            <strong>Recipe:</strong>
          </Typography>
        </div>
        <ReactQuill value={recipeText} onChange={setRecipeText} theme="snow" />

        <div className="item-detail-field" style={{ marginTop: "16px" }}>
          <LocalOfferIcon className="item-detail-icon" />
          <Typography variant="body2">
            <strong>Tags:</strong>
          </Typography>
        </div>
        <TextField
          label="Tags (comma-separated)"
          fullWidth
          margin="normal"
          value={tagString}
          onChange={handleTagChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
        <Button onClick={handleSave} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailDialog;
