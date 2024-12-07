import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import "./AddItemDialogstyle.css";

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  defaultTitle: string;
  onSubmit: (
    title: string,
    imageUrl: string,
    recipeText: string,
    cookTime: number
  ) => void;
}

const AddItemDialogOld
: React.FC<AddItemDialogProps> = ({
  open,
  onClose,
  images,
  defaultTitle,
  onSubmit,
}) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [title, setTitle] = useState("");
  const [recipeText, setRecipeText] = useState("");
  const [cookTime, setCookTime] = useState<number>(0);

  useEffect(() => {
    if (open) {
      // When dialog opens, set initial states
      setTitle(defaultTitle || "");
      setRecipeText("");
      setCookTime(0);
      if (images && images.length > 0) {
        setSelectedImage(images[0]);
      } else {
        setSelectedImage("");
      }
    }
  }, [open, defaultTitle, images]);

  const handleSubmit = () => {
    onSubmit(title, selectedImage, recipeText, cookTime);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Cook Time (mins)"
          type="number"
          fullWidth
          margin="normal"
          value={cookTime}
          onChange={(e) => setCookTime(Number(e.target.value))}
        />
        <TextField
          label="Recipe"
          multiline
          fullWidth
          minRows={4}
          margin="normal"
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
        />
        <Typography variant="subtitle1" gutterBottom>
          Select Image:
        </Typography>
        <div className="add-item-image-selection">
          {images.map((img) => (
            <img
              key={img}
              src={img}
              alt={img}
              className={`add-item-image ${
                selectedImage === img ? "selected" : ""
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialogOld;
