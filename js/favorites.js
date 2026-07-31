const favoriteArticlesStorageKey = "favoriteArticles";

export function getStoredFavoriteArticles() {
    try {
        const storedFavorites = localStorage.getItem(favoriteArticlesStorageKey);

        const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

        return Array.isArray(parsedFavorites) ? parsedFavorites : [];
    } catch (error) {
        console.error("Favorites could not be read from localStorage:", error);

        return [];
    }
}


function saveFavoriteArticles(favoriteArticles) {
    try {
        localStorage.setItem(
            favoriteArticlesStorageKey,
            JSON.stringify(favoriteArticles)
        );

        return true;
    } catch (error) {
        console.error("Favorites could not be saved to localStorage:", error);

        return false;
    }
}


export function isArticleFavorite(favoriteArticles, articleId) {
    return favoriteArticles.some((favoriteArticle) => {
        return favoriteArticle.id === articleId;
    });
}


export function toggleArticleFavorite(favoriteArticles, selectedArticle) {
    const isSaved = isArticleFavorite(favoriteArticles, selectedArticle.id);

    const updatedFavoriteArticles = isSaved 
        ? favoriteArticles.filter((favoriteArticle) => {
            return favoriteArticle.id !== selectedArticle.id;
        })
        : [...favoriteArticles, selectedArticle];
    
    const wereFavoritesSaved = saveFavoriteArticles(updatedFavoriteArticles);

    return wereFavoritesSaved ? updatedFavoriteArticles : favoriteArticles;
}


export function updateArticleFavoriteButton(button, article, isSaved) {
    const heartIcon = button.querySelector(".fa-heart");

    const favoriteLabel = button.querySelector("[data-favorite-label]");

    button.classList.toggle("saved", isSaved);
    button.setAttribute("aria-pressed", String(isSaved));

    button.setAttribute(
        "aria-label",
        isSaved
            ? `Remove ${article.title} from favorites`
            : `Add ${article.title} to favorites`
    );

    heartIcon.classList.toggle("fa-solid", isSaved);
    heartIcon.classList.toggle("fa-regular", !isSaved);

    if (favoriteLabel) {
        favoriteLabel.textContent = isSaved ? "Saved Article" : "Save Article";
    }
}