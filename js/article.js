import { getStoredFavoriteArticles, isArticleFavorite, toggleArticleFavorite, updateArticleFavoriteButton } from "./favorites.js";

const articleContent = document.querySelector(".article-detail-content");

let favoriteArticles = getStoredFavoriteArticles();

async function loadArticle() {
    try {
        const urlParameters = new URLSearchParams(window.location.search);
        const articleId = Number(urlParameters.get("id"));

        if (!Number.isInteger(articleId) || articleId <= 0) {
            throw new Error("No article was selected.");
        }

        const response = await fetch("data/articles.json");

        if (!response.ok) {
            throw new Error("The article data could not be loaded.");
        }

        const articles = await response.json();

        if (!Array.isArray(articles)) {
            throw new Error("The article data is not valid.");
        }

        const selectedArticle = articles.find(
            (article) => article.id === articleId
        );

        if (!selectedArticle) {
            throw new Error("The selected article could not be found.");
        }

        document.title = `Clovolt | ${selectedArticle.title}`;

        const articleParagraphs = createArticleParagraphs(selectedArticle.content);

        articleContent.innerHTML = `
            <article class="article-detail">
                <header class="article-detail-header">
                    <p class="article-detail-category">
                        ${selectedArticle.category}
                    </p>

                    <h1 class="article-detail-title">
                        ${selectedArticle.title}
                    </h1>

                    <p class="article-detail-excerpt">
                        ${selectedArticle.excerpt}
                    </p>

                    <div class="article-detail-meta">
                        <span>${selectedArticle.date}</span>
                        <span aria-hidden="true">•</span>
                        <span>${selectedArticle.readingTime}</span>
                    </div>

                    <button 
                        class="article-detail-favorite-button"
                        type="button"
                        data-article-favorite
                        aria-label="Add ${selectedArticle.title} to favorites"
                        aria-pressed="false">

                        <i class="fa-regular fa-heart" aria-hidden="true"></i>
                    </button>
                </header>

                <figure class="article-detail-image-container">
                    <img 
                        class="article-detail-image"
                        src="${selectedArticle.image}"
                        alt="${selectedArticle.title}"
                    >
                </figure>

                <div class="article-detail-body">${articleParagraphs}</div>

                <footer class="article-detail-actions">
                    <a class="article-detail-back-link" href="explore.html">
                        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>

                        Back to Explore
                    </a>

                    <button
                        class="article-detail-save-button"
                        type="button"
                        data-article-favorite
                        aria-label="Add ${selectedArticle.title} to favorites"
                        aria-pressed="false">

                        <span data-favorite-label>Save Article</span>

                        <i class="fa-regular fa-heart" aria-hidden="true"></i>
                    </button>
                </footer>
            </article>

            <section 
                class="related-articles"
                aria-labelledby="related-articles-title">

                <h2
                    class="related-articles-title"
                    id="related-articles-title">

                    Related Articles
                </h2>

                <div class="related-articles-grid"></div>
            </section>
        `;

        setupArticleFavoriteButtons(selectedArticle);

        renderRelatedArticles(articles, selectedArticle);
    } catch (error) {
        console.error(error);

        articleContent.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}


function setupArticleFavoriteButtons(article) {
    const favoriteButtons = articleContent.querySelectorAll(
        "[data-article-favorite]"
    );

    function updateAllFavoriteButtons() {
        const isSaved = isArticleFavorite(favoriteArticles, article.id);

        favoriteButtons.forEach((button) => {
            updateArticleFavoriteButton(button, article, isSaved);
        });
    }

    function refreshArticleFavorites() {
        favoriteArticles = getStoredFavoriteArticles();

        updateAllFavoriteButtons();
    }

    refreshArticleFavorites();

    favoriteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            favoriteArticles = toggleArticleFavorite(
                favoriteArticles,
                article
            );

            updateAllFavoriteButtons();
        });
    });

    window.addEventListener("pageshow", refreshArticleFavorites);

    window.addEventListener("storage", (event) => {
        if (event.key === "favoriteArticles") {
            refreshArticleFavorites();
        }
    });
}


function createArticleParagraphs(content) {
    return content.map((paragraph) => {
        return `<p>${paragraph}</p>`;
    })
    .join("");
}


function renderRelatedArticles(articles, selectedArticle) {
    const relatedArticlesSection = articleContent.querySelector(".related-articles");

    const relatedArticlesGrid = articleContent.querySelector(".related-articles-grid");

    const relatedArticles = articles.filter((article) => {
        return (
            article.category === selectedArticle.category &&
            article.id !== selectedArticle.id
        );
    })
    .slice(0, 2);

    if (relatedArticles.length === 0) {
        relatedArticlesSection.hidden = true;
        return;
    }

    relatedArticlesGrid.innerHTML = relatedArticles.map((article) => {
        return `
            <article class="related-article-card">
                <a
                    class="related-article-card-link"
                    href="article.html?id=${article.id}">

                    <img
                        class="related-article-image"
                        src="${article.image}"
                        alt="${article.title}"
                    >

                    <div class="related-article-info">
                        <p class="related-article-category">
                            ${article.category}
                        </p>

                        <h3 class="related-article-title">
                            ${article.title}
                        </h3>

                        <div class="related-article-meta">
                            <span>${article.date}</span>
                            <span aria-hidden="true">•</span>
                            <span>${article.readingTime}</span>
                        </div>

                        <span class="related-article-read-link">
                            Read Article

                            <i
                                class="fa-solid fa-arrow-right"
                                aria-hidden="true"
                            ></i>
                        </span>
                    </div>
                </a>
            </article>
        `;
    })
    .join("");
}


loadArticle();