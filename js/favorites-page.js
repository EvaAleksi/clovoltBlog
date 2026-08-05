import {
    getStoredFavoriteArticles,
    getStoredFavoriteLooks,
    isArticleFavorite,
    isLookFavorite,
    toggleArticleFavorite,
    toggleLookFavorite,
    updateArticleFavoriteButton,
    updateLookFavoriteButton
} from "./favorites.js";

const totalFavoriteCount = document.querySelector(
    "#favorites-summary-title"
);

const favoriteArticlesCount = document.querySelector(
    "#favorite-articles-count"
);

const favoriteLooksCount = document.querySelector(
    "#favorite-looks-count"
);

const tabButtons = Array.from(
    document.querySelectorAll(".favorites-tab")
);

const articlesPanel = document.querySelector(
    "#saved-articles-panel"
);

const looksPanel = document.querySelector(
    "#saved-looks-panel"
);

const articlesPanelCount = document.querySelector(
    "#saved-articles-panel-count"
);

const looksPanelCount = document.querySelector(
    "#saved-looks-panel-count"
);

const articlesGrid = document.querySelector(
    "#saved-articles-grid"
);

const looksGrid = document.querySelector(
    "#saved-looks-grid"
);

let favoriteArticles = getStoredFavoriteArticles();
let favoriteLooks = getStoredFavoriteLooks();


function formatItemCount(count, singular, plural) {
    return `${count} ${count === 1 ? singular : plural}`;
}


function createEmptyState(
    title,
    description,
    linkText,
    linkUrl
) {
    return `
        <div class="favorites-empty-state">
            <h3>${title}</h3>

            <p>${description}</p>

            <a
                class="favorites-empty-link"
                href="${linkUrl}">

                ${linkText}

                <i
                    class="fa-solid fa-arrow-right"
                    aria-hidden="true">
                </i>
            </a>
        </div>
    `;
}


function createArticleCard(article) {
    const isSaved = isArticleFavorite(
        favoriteArticles,
        article.id
    );

    return `
        <article class="article-card">
            <div class="article-image">
                <img
                    src="${article.image}"
                    alt="${article.title}"
                >

                <span class="article-category">
                    ${article.category}
                </span>

                <button
                    class="article-favorite${isSaved ? " saved" : ""}"
                    type="button"
                    data-article-id="${article.id}"
                    aria-label="Remove ${article.title} from favorites"
                    aria-pressed="${isSaved}">

                    <i
                        class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart"
                        aria-hidden="true">
                    </i>
                </button>
            </div>

            <div class="article-content">
                <div class="article-meta">
                    <span>${article.date}</span>
                    <span>${article.readingTime}</span>
                </div>

                <h3>${article.title}</h3>

                <p class="article-excerpt">
                    ${article.excerpt}
                </p>

                <a
                    class="read-article-link"
                    href="article.html?id=${article.id}">

                    Read Article

                    <i
                        class="fa-solid fa-arrow-right"
                        aria-hidden="true">
                    </i>
                </a>
            </div>
        </article>
    `;
}


function createLookCard(look) {
    const isSaved = isLookFavorite(
        favoriteLooks,
        look.id
    );

    return `
        <article class="shop-look-card">
            <a
                class="shop-look-link"
                href="look.html?id=${look.id}">

                <img
                    class="shop-look-image"
                    src="${look.image}"
                    alt="${look.name}"
                >
            </a>

            <button
                class="shop-favorite-button${isSaved ? " saved" : ""}"
                type="button"
                data-look-id="${look.id}"
                aria-label="Remove ${look.name} from favorites"
                aria-pressed="${isSaved}">

                <i
                    class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart"
                    aria-hidden="true">
                </i>
            </button>
        </article>
    `;
}


function renderSummary() {
    const articleCount = favoriteArticles.length;
    const lookCount = favoriteLooks.length;
    const totalCount = articleCount + lookCount;

    totalFavoriteCount.textContent = formatItemCount(
        totalCount,
        "item saved",
        "items saved"
    );

    favoriteArticlesCount.textContent = articleCount;
    favoriteLooksCount.textContent = lookCount;

    articlesPanelCount.textContent = formatItemCount(
        articleCount,
        "article saved",
        "articles saved"
    );

    looksPanelCount.textContent = formatItemCount(
        lookCount,
        "look saved",
        "looks saved"
    );
}


function renderArticles() {
    if (favoriteArticles.length === 0) {
        articlesGrid.innerHTML = createEmptyState(
            "No saved articles yet.",
            "Discover a fashion story and use the heart button to keep it here.",
            "Explore Articles",
            "explore.html"
        );
    } else {
        articlesGrid.innerHTML = favoriteArticles.map(
            (article) => {
                return createArticleCard(article);
            }
        )
        .join("");
    }
}


function renderLooks() {
    if (favoriteLooks.length === 0) {
        looksGrid.innerHTML = createEmptyState(
            "No saved looks yet.",
            "Explore the curated outfits and use the heart button to save your favorites.",
            "Shop the Look",
            "shop-the-look.html"
        );

        return;
    }

    looksGrid.innerHTML = favoriteLooks.map((look) => {
        return createLookCard(look);
    })
    .join("");
}


function renderFavorites() {
    renderSummary();
    renderArticles();
    renderLooks();
}


function activateTab(tabName, moveFocus = false) {
    tabButtons.forEach((button) => {
        const isActive = button.dataset.tab === tabName;

        button.classList.toggle("active", isActive);
        button.setAttribute(
            "aria-selected",
            String(isActive)
        );

        button.tabIndex = isActive ? 0 : -1;

        if (isActive && moveFocus) {
            button.focus();
        }
    });

    articlesPanel.hidden = tabName !== "articles";
    looksPanel.hidden = tabName !== "looks";
}


tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activateTab(button.dataset.tab);
    });
});


document
    .querySelector(".favorites-tabs")
    .addEventListener("keydown", (event) => {
        const isArrowKey =
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight";

        if (!isArrowKey) {
            return;
        }

        event.preventDefault();

        const currentTabIndex = tabButtons.findIndex(
            (button) => {
                return button.getAttribute(
                    "aria-selected"
                ) === "true";
            }
        );

        const direction =
            event.key === "ArrowRight" ? 1 : -1;

        const nextTabIndex = (
            currentTabIndex +
            direction +
            tabButtons.length
        ) % tabButtons.length;

        activateTab(
            tabButtons[nextTabIndex].dataset.tab,
            true
        );
    });


articlesGrid.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest(
        ".article-favorite"
    );

    if (!favoriteButton) {
        return;
    }

    const articleId = Number(
        favoriteButton.dataset.articleId
    );

    const selectedArticle = favoriteArticles.find(
        (article) => {
            return article.id === articleId;
        }
    );

    if (!selectedArticle) {
        console.error(
            `Article with ID ${articleId} was not found.`
        );

        return;
    }

    favoriteArticles = toggleArticleFavorite(
        favoriteArticles,
        selectedArticle
    );

    const isSaved = isArticleFavorite(
        favoriteArticles,
        articleId
    );

    updateArticleFavoriteButton(
        favoriteButton,
        selectedArticle,
        isSaved
    );

    renderFavorites();
});


function removeSavedLook(event) {
    const favoriteButton = event.target.closest(
        ".shop-favorite-button"
    );

    if (!favoriteButton) {
        return;
    }

    const lookId = Number(
        favoriteButton.dataset.lookId
    );

    const selectedLook = favoriteLooks.find(
        (look) => {
            return look.id === lookId;
        }
    );

    if (!selectedLook) {
        console.error(
            `Look with ID ${lookId} was not found.`
        );

        return;
    }

    favoriteLooks = toggleLookFavorite(
        favoriteLooks,
        selectedLook
    );

    const isSaved = isLookFavorite(
        favoriteLooks,
        lookId
    );

    updateLookFavoriteButton(
        favoriteButton,
        selectedLook,
        isSaved
    );

    renderFavorites();
}


looksGrid.addEventListener(
    "click",
    removeSavedLook
);


window.addEventListener("storage", () => {
    favoriteArticles = getStoredFavoriteArticles();
    favoriteLooks = getStoredFavoriteLooks();

    renderFavorites();
});


renderFavorites();