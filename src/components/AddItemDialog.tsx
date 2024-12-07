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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
    cookTime: number,
    tags: string[]
  ) => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
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
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      // Reset fields when dialog opens
      setTitle(defaultTitle || "");
      setRecipeText("");
      setCookTime(0);
      setTags([]);
      if (images && images.length > 0) {
        setSelectedImage(images[0]);
      } else {
        setSelectedImage("");
      }
    }
  }, [open, defaultTitle, images]);

  const handleFocusCookTime = () => {
    if (cookTime === 0) {
      setCookTime(NaN); // set to NaN to clear field visually
    }
  };

  const handleBlurCookTime = () => {
    if (isNaN(cookTime)) {
      setCookTime(0);
    }
  };

  const handleCookTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setCookTime(NaN);
    } else {
      setCookTime(Number(val));
    }
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

  const handleSubmit = () => {
    onSubmit(
      title,
      selectedImage,
      recipeText,
      isNaN(cookTime) ? 0 : cookTime,
      tags
    );
    onClose();
  };

  const tagString = tags.join(", ");

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
          value={isNaN(cookTime) ? "" : cookTime}
          onFocus={handleFocusCookTime}
          onBlur={handleBlurCookTime}
          onChange={handleCookTimeChange}
        />
        <Typography variant="subtitle1" gutterBottom>
          Recipe (Rich Text):
        </Typography>
        <ReactQuill value={recipeText} onChange={setRecipeText} theme="snow" />
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginTop: "16px" }}
        >
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
        <TextField
          label="Tags (comma-separated)"
          fullWidth
          margin="normal"
          value={tagString}
          onChange={handleTagChange}
        />
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

export default AddItemDialog;
