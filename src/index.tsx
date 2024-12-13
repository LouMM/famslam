import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

function getQueryParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const userId = getQueryParam("userid") || "Guest";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App loggedInUser={userId} />);
