import { getStoredFavoriteArticles, isArticleFavorite, toggleArticleFavorite, updateArticleFavoriteButton } from "./favorites.js";

const articlesGrid = document.querySelector("#explore-articles-grid");
const articlesResultCount = document.querySelector("#articles-result-count");
const noResultMessage = document.querySelector("#no-results-message");
const loadMoreButton = document.querySelector("#load-more-button");
const loadMoreContainer = document.querySelector(".load-more-container");
const searchForm = document.querySelector("#article-search");
const searchInput = document.querySelector("#article-search-input");
const categoryFilters = document.querySelectorAll(".category-filter");

const initialVisibleArticleCount = 4;
const articlesPerLoad = 4;

let allArticles = [];
let favoriteArticles = getStoredFavoriteArticles();
let filteredArticles = [];
let visibleArticleCount = initialVisibleArticleCount;
let activeCategory = "all";


async function loadArticles() {
    try {
        const response = await fetch("data/articles.json");

        if (!response.ok) {
            throw new Error("Articles could not be loaded.");
        }

        allArticles = await response.json();

        if (!Array.isArray(allArticles) || allArticles.length === 0) {
            throw new Error("No articles were found.");
        }

        applyCategoryFromUrl();
        applyArticleFilters();
    } catch (error) {
        console.error(error);

        articlesGrid.innerHTML = `
            <p class="error-message">
                Articles could not be loaded. Please try again later.
            </p>
        `;
    }
}


function createArticleCard(article, index) {
    const articleNumber = String(index + 1).padStart(2, "0");

    const isSaved = isArticleFavorite(favoriteArticles, article.id);

    const favoriteButtonClass = isSaved ? "explore-favorite-button saved" : "explore-favorite-button";

    const heartIconClass = isSaved ? "fa-solid" : "fa-regular";

    const favoriteButtonLabel = isSaved ? `Remove ${article.title} from favorites` : `Add ${article.title} to favorites`;

    return `
        <article class="explore-article-card">
            <div class="explore-article-image-container">
                <img
                    class="explore-article-image"
                    src="${article.image}"
                    alt="${article.title}"
                >

                <span class="explore-article-number">${articleNumber}</span>

                <button 
                    class="${favoriteButtonClass}"
                    type="button"
                    data-article-id="${article.id}"
                    aria-label="${favoriteButtonLabel}"
                    aria-pressed="${isSaved}">

                    <i 
                        class="${heartIconClass} fa-heart"
                        aria-hidden="true"
                    ></i>
                </button>
            </div>

            <div class="explore-article-content">
                <p class="explore-article-category">${article.category}</p>

                <h3>${article.title}</h3>

                <p class="explore-article-excerpt">${article.excerpt}</p>

                <div class="explore-article-meta">
                    <span>${article.date}</span>
                    <span>${article.readingTime}</span>
                </div>

                <a
                    href="article.html?id=${article.id}"
                    class="read-article-link">

                    Read Article
                </a>
            </div>
        </article>
    `;
}


articlesGrid.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest(".explore-favorite-button");

    if (!favoriteButton) {
        return;
    }

    const articleId = Number(favoriteButton.dataset.articleId);

    const selectedArticle = allArticles.find((article) => {
        return article.id === articleId;
    });

    if (!selectedArticle) {
        console.error(`Article with ID ${articleId} was not found.`);

        return;
    }

    favoriteArticles = toggleArticleFavorite(favoriteArticles, selectedArticle);

    const isSaved = isArticleFavorite(favoriteArticles, articleId);

    updateArticleFavoriteButton(favoriteButton, selectedArticle, isSaved);
});


function renderArticles() {
    const visibleArticles = filteredArticles.slice(0, visibleArticleCount);

    articlesGrid.innerHTML = visibleArticles.map((article, index) => {
        return createArticleCard(article, index);
    })
    .join("");

    const displayedArticleCount = visibleArticles.length;
    const totalArticleCount = filteredArticles.length;

    articlesResultCount.textContent = totalArticleCount === 0
        ? "No articles found"
        : `Showing ${displayedArticleCount} of ${totalArticleCount} articles`;
    
    noResultMessage.hidden = totalArticleCount !== 0;

    const hasExpandableArticles = totalArticleCount > initialVisibleArticleCount;

    if (!hasExpandableArticles) {
        loadMoreContainer.hidden = true;
        loadMoreButton.textContent = "Load More";
        loadMoreButton.setAttribute("aria-label", "Show more articles");

        return;
    }

    loadMoreContainer.hidden = false;

    const isShowingAll = displayedArticleCount >= totalArticleCount;

    loadMoreButton.textContent = isShowingAll ? "Show Less" : "Load More";

    loadMoreButton.setAttribute(
        "aria-label",
        isShowingAll ? "Show fewer articles" : "Show more articles"
    );
}


function applyArticleFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    filteredArticles = allArticles.filter((article) => {
        const searchableArticleText = `
            ${article.title || ""}
            ${article.excerpt || ""}
            ${article.category || ""}
        `.toLowerCase();

        const articleCategory = String(article.category || "").toLowerCase();

        const matchesSearch = searchableArticleText.includes(searchTerm);

        const matchesCategory = 
            activeCategory === "all" ||
            articleCategory === activeCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    visibleArticleCount = initialVisibleArticleCount;

    renderArticles();
}


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    applyArticleFilters();
});

searchInput.addEventListener("input", () => {
    applyArticleFilters();
});


function selectCategory(selectedButton) {
    activeCategory = selectedButton.dataset.category;

    categoryFilters.forEach((button) => {
        const isActive = button === selectedButton;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}


function applyCategoryFromUrl() {
    const urlParameters = new URLSearchParams(window.location.search);

    const categoryFromUrl = urlParameters.get("category");

    if (!categoryFromUrl) {return;}

    const matchingButton = Array.from(categoryFilters).find((button) => {
        return button.dataset.category.toLowerCase() === categoryFromUrl.toLowerCase();
    });

    if (!matchingButton) {return;}

    selectCategory(matchingButton);
}


categoryFilters.forEach((categoryButton) => {
    categoryButton.addEventListener("click", () => {
        selectCategory(categoryButton);

        applyArticleFilters();
    });
});


loadMoreButton.addEventListener("click", () => {
    const isShowingAll = visibleArticleCount >= filteredArticles.length;

    if (isShowingAll) {
        visibleArticleCount = initialVisibleArticleCount;
    } else {
        visibleArticleCount = Math.min(
            visibleArticleCount + articlesPerLoad,
            filteredArticles.length
        );
    }

    renderArticles();
});


function refreshArticleFavorites() {
    favoriteArticles = getStoredFavoriteArticles();

    if (allArticles.length > 0) {
        renderArticles();
    }
}


window.addEventListener("pageshow", () => {
    refreshArticleFavorites();
});


window.addEventListener("storage", (event) => {
    if (event.key === "favoriteArticles") {
        refreshArticleFavorites();
    }
});


loadArticles();