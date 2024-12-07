import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import ItemList from "./ItemList";
import AddItemDialog from "./AddItemDialog";
import { RecipeItem } from "../types";
import "./App.css"; // ensure styles are applied

const App: React.FC = () => {
  const [items, setItems] = useState<RecipeItem[]>([]);
  const [url, setUrl] = useState<string>("");
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);
  const [fetchedTitle, setFetchedTitle] = useState<string>("");
  const [pageToFetch, setPageToFetch] = useState<string>("");

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  function addErrorMessage(msg: string) {
    setErrorMessages((prev) => [...prev, msg]);
  }

  const handleFetchPage = async () => {
    try {
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
      const firstFive = imgElements.slice(0, 5).map((img) => img.src);

      // Validate images
      const validImages: string[] = [];
      for (const imgUrl of firstFive) {
        if (!imgUrl) continue;
        const ok = await canLoadImage(imgUrl);
        if (ok) validImages.push(imgUrl);
      }

      setFetchedImages(validImages);
      setFetchedTitle(pageTitle);
      setOpenAddDialog(true);
      setPageToFetch(url);
      setUrl(""); // Clear the url text field after fetch
    } catch (error: any) {
      addErrorMessage("Error fetching page: " + error.message);
    }
  };

  async function canLoadImage(u: string) {
    // Check extension first
    const allowedExt = ["jpg", "jpeg", "png", "bmp", "gif"];
    const ext = u.split(".").pop()?.toLowerCase() || "";
    if (!allowedExt.includes(ext)) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = u;
    });
  }

  const handleAddItem = (
    title: string,
    imageUrl: string,
    recipeText: string,
    cookTime: number
  ) => {
    try {
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
    } catch (err: any) {
      addErrorMessage("Error adding item: " + err.message);
    }
  };

  const playSwoosh = () => {
    const audio = new Audio("sounds/swoosh.mp3");
    audio.play().catch((e) => {});
  };

  const playDelete = () => {
    const audio = new Audio("sounds/delete.mp3");
    audio.play().catch((e) => {});
  };

  const handleItemsReordered = (newItems: RecipeItem[]) => {
    try {
      setItems(newItems);
      playSwoosh();
    } catch (err: any) {
      addErrorMessage("Error reordering items: " + err.message);
    }
  };

  const handleItemDeleted = (id: string) => {
    try {
      setItems((prev) => prev.filter((item) => item.id !== id));
      playDelete();
    } catch (err: any) {
      addErrorMessage("Error deleting item: " + err.message);
    }
  };

  function clearErrors() {
    setErrorMessages([]);
  }

  useEffect(() => {
    console.log("List changed:", items);
  }, [items]);

  return (
    <Container className="app-container">
      <Typography variant="h4" gutterBottom>
        FamSlam
      </Typography>
      <div className="app-header">
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
        errorMessages={errorMessages}
        clearErrors={clearErrors}
      />
      <AddItemDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        images={fetchedImages}
        defaultTitle={fetchedTitle}
        onSubmit={handleAddItem}
      />
    </Container>
  );
};

export default App;
