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
  Box,
  Chip,
} from "@mui/material";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";
import ReactQuill from "react-quill";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import "react-quill/dist/quill.snow.css";

import "./ItemDetailDialog.css";
import { RecipeItem } from "../types";

interface ItemDetailDialogProps {
  item: RecipeItem;
  onClose: () => void;
  onSave: (updatedItem: RecipeItem) => void;
  onDelete: (id: string) => void;
}

const ItemDetailDialog: React.FC<ItemDetailDialogProps> = ({
  item,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(item.title);
  const [cookTime, setCookTime] = useState(item.cookTime);
  const [recipeText, setRecipeText] = useState(item.recipeText || "");
  const [tags, setTags] = useState(item.tags || []);
  const [url, setUrl] = useState(item.url || "");
  const [urlEditable, setUrlEditable] = useState(false);
  const [currentTag, setCurrentTag] = useState("");

  const handleSave = () => {
    item.recipeText = recipeText;
    item.tags = tags;
    onSave({
      ...item,
      title,
      cookTime,
      recipeText,
      tags,
      url,
    });
    onClose();
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    const newTags = val
      ? val
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];
    setTags(newTags);
  };

  const handleCookTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCookTime(Number(e.target.value.trim()) || 0);
  };
  const handleBlurCookTime = () => {
    if (isNaN(cookTime)) {
      setCookTime(0);
    }
  };
  const handleFocusCookTime = () => {
    if (cookTime === 0) {
      setCookTime(NaN); // set to NaN to clear field visually
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (currentTag.trim()) {
        setTags([...tags, `#${currentTag.trim()}`]);
        setCurrentTag("");
      }
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleUrlClick = () => {
    if (!urlEditable && url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>📝 Item Details</DialogTitle>
      <DialogContent dividers>
        <img
          src={item.imageUrl}
          alt={item.title}
          className="item-detail-image"
        />
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="item-detail-field">
          <LinkIcon />
          <TextField
            label="URL"
            fullWidth
            margin="normal"
            value={url}
            disabled={!urlEditable}
            onChange={(e) => setUrl(e.target.value)}
            InputProps={{
              endAdornment: (
                <>
                  <IconButton onClick={handleUrlClick} size="small">
                    <OpenInNewIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setUrlEditable((prev) => !prev)}
                    size="small"
                  >
                    {urlEditable ? <SaveIcon /> : <EditIcon />}
                  </IconButton>
                </>
              ),
            }}
          />
        </div>
        <div className="item-detail-field">
          <HistoryIcon />
          <TextField
            label="Cook Time (mins)"
            type="number"
            fullWidth
            margin="normal"
            value={cookTime}
            onBlur={handleBlurCookTime}
            onFocus={handleFocusCookTime}
            onChange={handleCookTimeChange}
          />
        </div>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Recipe:</strong>
        </Typography>
        <ReactQuill value={recipeText} onChange={setRecipeText} theme="snow" />
        <Typography variant="subtitle1" gutterBottom style={{ marginTop: 16 }}>
          🏷️Tags:
        </Typography>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          sx={{ alignItems: "center" }}
        >
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              color="primary"
              onDelete={() => handleTagDelete(tag)}
            />
          ))}
          <TextField
            value={currentTag}
            placeholder="Add tags, comma seperated..."
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyPress}
            size="small"
            variant="outlined"
            style={{ flex: "1 0 auto", minWidth: "150px" }}
            fullWidth
          />
        </Box>
        {/* <TextField
          label="Tags (comma-separated)"
          fullWidth
          margin="normal"
          value={tags.join(", ")}
          onChange={handleTagChange}
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onDelete(item.id)} color="error">
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailDialog;
