import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import ItemList from "./ItemList";
import AddItemDialog from "./AddItemDialog";
import { RecipeItem } from "../types";
import "./App.css";
import CloseIcon from "@mui/icons-material/Close";

const App: React.FC = () => {
  const [items, setItems] = useState<RecipeItem[]>([]);
  const [url, setUrl] = useState<string>("");
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);
  const [fetchedTitle, setFetchedTitle] = useState<string>("");
  const [pageToFetch, setPageToFetch] = useState<string>("");

  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [urlValid, setUrlValid] = useState(true);

  function addErrorMessage(msg: string) {
    setErrorMessages((prev) => [...prev, msg]);
  }

  function clearErrors() {
    setErrorMessages([]);
  }

  const isValidHttpUrl = (input: string) => {
    let url;
    try {
      url = new URL(input);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  };

  const handleFetchPage = async () => {
    try {
      if (!url) return;
      if (!isValidHttpUrl(url)) {
        setUrlValid(false);
        return;
      }
      setUrlValid(true);

      const proxyUrl = `http://localhost:5000/fetch-html?url=${encodeURIComponent(
        url
      )}`;
      const response = await fetch(proxyUrl);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const pageTitle = doc.querySelector("title")?.innerText || "";

      const imgElements = Array.from(doc.querySelectorAll("img"));
      const firstFive = imgElements.slice(0, 10).map((img) => img.src);

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
    cookTime: number,
    tags: string[]
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
        tags,
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

  useEffect(() => {
    console.log("List changed:", items);
  }, [items]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (!val) {
      setUrlValid(true); // clear value = no error
    } else {
      setUrlValid(isValidHttpUrl(val));
    }
  };

  return (
    <Container className="app-container">
      <div className="title-bar">
        <img
          src={require("../assets/FamSlamSQ.jpg")}
          alt="FamSlam"
          className="title-icon"
        />
        <span className="title-text" >
          FamSlam
        </span>
      </div>
      <div className="app-header">
        <div className="url-field-wrapper">
          <TextField
              label="Page URL"
            variant="outlined"
            value={url}
            onChange={handleUrlChange}
            fullWidth
            InputProps={{
              startAdornment:
                !urlValid && url ? (
                  <InputAdornment position="start">
                    <CloseIcon style={{ color: "red" }} />
                  </InputAdornment>
                ) : undefined,
            }}
          />
        </div>
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
