import { siteDetails } from "../types";

const API_BASE_URL = "http://localhost:8080";
const API_KEY = "123456";

let headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json"
};


const apiService = {
    async getImages(url: string): Promise<siteDetails> {
        const proxyUrl = `${API_BASE_URL}/fetch-html?url=${encodeURIComponent(url)}`;
        const htmlFetchResponse = await fetch(proxyUrl, { headers });
        const pageText = await htmlFetchResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageText, "text/html");
        const pageTitle = doc.querySelector("title")?.innerText || "";

        const imgElements = Array.from(doc.querySelectorAll("img"));
        const imgCollection = imgElements.slice(0, 10).map((img) => img.src);
        return { pageTitle, images: imgCollection } as siteDetails;
    },

    async getRecipes() {
        headers = { ...headers, "Content-Type": "application/json" }
        const response = await fetch(`${API_BASE_URL}/recipes`, { headers });
        if (!response.ok) {
            throw new Error("Failed to fetch recipes");
        }
        return response.json();
    },

    async createRecipe(recipe: any) {
        const response = await fetch(`${API_BASE_URL}/recipes`, {
            method: "POST",
            headers,
            body: JSON.stringify(recipe),
        });
        if (!response.ok) {
            throw new Error("Failed to create recipe");
        }
        return response.json();
    },

    async updateRecipe(id: string, recipe: any) {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(recipe),
        });
        if (!response.ok) {
            throw new Error("Failed to update recipe");
        }
        return response.json();
    },

    async deleteRecipe(id: string) {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
            method: "DELETE",
            headers,
        });
        if (!response.ok) {
            throw new Error("Failed to delete recipe");
        }
    },
};

export default apiService;
