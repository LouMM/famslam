export interface RecipeItem {
    id: string;
    title: string;
    imageUrl: string;
    hasRecipe: boolean;
    cookTime: number;
    url?: string;
    recipeText?: string;
    tags?: string[];
}

export interface siteDetails{
    pageTitle: string;
    images:string[];
}