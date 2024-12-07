import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import ItemList from "./ItemList";
import AddItemDialog from "./AddItemDialog";
import { RecipeItem } from "../types";

import "./App.css";

const AppOld: React.FC = () => {
  const [items, setItems] = useState<RecipeItem[]>([]);
  const [url, setUrl] = useState<string>("");
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);
  const [fetchedTitle, setFetchedTitle] = useState<string>("");
  const [pageToFetch, setPageToFetch] = useState<string>("");

  async function canLoadImage(url: string) {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // For simplicity, integrate the fetch logic inline (you could use the custom hook above)
  const handleFetchPage = async () => {
    if (!url) return;
    const proxyUrl = `http://localhost:5000/fetch-html?url=${encodeURIComponent(
      url
    )}`;
    const response = await fetch(proxyUrl);
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const pageTitle = doc.querySelector("title")?.innerText || "";

    const imgElements = Array.from(doc.querySelectorAll("img"));
    // We'll skip the HEAD request for size due to complexity in a quick demo
    // Instead just pick the first 5 images as a placeholder
    const firstFiveRaw = imgElements.slice(0, 5).map((img) => img.src);
    // Validate images by attempting to load them
    const validImages: string[] = [];

    for (const imgUrl of firstFiveRaw) {
      if (!imgUrl) continue;
      const ok = await canLoadImage(imgUrl);
      if (ok) validImages.push(imgUrl);
    }

    setFetchedImages(validImages);
    setFetchedTitle(pageTitle);
    setOpenAddDialog(true);
    setPageToFetch(url);
  };

  const handleAddItem = (
    title: string,
    imageUrl: string,
    recipeText: string,
    cookTime: number
  ) => {
    const newItem: RecipeItem = {
      id: uuidv4(),
      title,
      imageUrl,
      hasRecipe: recipeText.trim().length > 0,
      cookTime,
      url: pageToFetch,
      recipeText,
    };
    setItems((prev) => [...prev, newItem]);
    setPageToFetch("");
  };

  // Play sounds on certain actions (dummy code)
  const playSwoosh = () => {
    const audio = new Audio("sounds/swoosh.mp3");
    audio.play();
  };

  const playDelete = () => {
    const audio = new Audio("sounds/delete.mp3");
    audio.play();
  };

  const handleItemsReordered = (newItems: RecipeItem[]) => {
    setItems(newItems);
    //playSwoosh();
  };

  const handleItemDeleted = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    //playDelete();
  };

  // On change event firing
  useEffect(() => {
    // Here you could do a callback or dispatch event to save data
    console.log("List changed:", items);
  }, [items]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        FamSlam
      </Typography>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <TextField
          label="Page URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleFetchPage}>
          Fetch
        </Button>
      </div>
      <ItemList
        items={items}
        onReorder={handleItemsReordered}
        onDelete={handleItemDeleted}
      />
      <AddItemDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        images={fetchedImages}
        defaultTitle={fetchedTitle}
        onSubmit={handleAddItem}
      />
      <div className="error-pane">
        {errorMessages.map((msg, index) => (
          <div key={index} className="error-message">
            {msg}
          </div>
        ))}
      </div>
    </Container>
  );
};

const [errorMessages, setErrorMessages] = useState<string[]>([]);
function addErrorMessage(msg: string) {
  setErrorMessages((prev) => [...prev, msg]);
}

export default AppOld;
