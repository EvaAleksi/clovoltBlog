import { getStoredFavoriteArticles, isArticleFavorite, toggleArticleFavorite, updateArticleFavoriteButton } from "./favorites.js";

const heroCarousel = document.getElementById("hero-carousel");
const carouselSlides = document.querySelectorAll(".carousel-slide");
const previousSlideButton = document.querySelector(".previous-slide");
const nextSlideButton = document.querySelector(".next-slide");
const carouselIndicators = document.querySelectorAll(".carousel-indicator");

let currentSlideIndex = 0;

function showSlide(slideIndex) {
    carouselSlides.forEach((slide, index) => {
        const isActive = index === slideIndex;

        slide.classList.toggle("active", isActive);

        slide.setAttribute(
            "aria-hidden",
            String(!isActive)
        );

        slide.inert = !isActive;
    });

    carouselIndicators.forEach((indicator, index) => {
        const isActive = index === slideIndex;

        indicator.classList.toggle("active", isActive);

        if (isActive) {
            indicator.setAttribute("aria-current", "true");
        } else {
            indicator.removeAttribute("aria-current");
        }
    });

    currentSlideIndex = slideIndex;
}


previousSlideButton.addEventListener("click", () => {
    const previousSlideIndex = (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;

    showSlide(previousSlideIndex);
});


nextSlideButton.addEventListener("click", () => {
    const nextSlideIndex = (currentSlideIndex + 1) % carouselSlides.length;

    showSlide(nextSlideIndex);
});


carouselIndicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
        const selectedSlideIndex = Number(indicator.dataset.slideIndex);

        showSlide(selectedSlideIndex);
    });
});


let automaticSlideInterval;

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


function startAutomaticSliding() {
    clearInterval(automaticSlideInterval);
    
    automaticSlideInterval = setInterval(() => {
        const nextSlideIndex = (currentSlideIndex + 1) % carouselSlides.length;

        showSlide(nextSlideIndex);
    }, 5000);
}


function stopAutomaticSliding() {
    clearInterval(automaticSlideInterval);
}


function restartAutomaticSlidingIfAllowed() {
    const isMouseInside = heroCarousel.matches(":hover");
    const containsKeyboardFocus = heroCarousel.contains(document.activeElement);

    if (!isMouseInside && !containsKeyboardFocus) {
        startAutomaticSliding();
    }
}


if (!prefersReducedMotion) {
    heroCarousel.addEventListener(
        "mouseenter",
        stopAutomaticSliding
    );

    heroCarousel.addEventListener(
        "mouseleave",
        restartAutomaticSlidingIfAllowed
    );

    heroCarousel.addEventListener(
        "focusin",
        stopAutomaticSliding
    );

    heroCarousel.addEventListener("focusout", (event) => {
        const focusRemainInside = heroCarousel.contains(
            event.relatedTarget
        );

        if (!focusRemainInside) {
            restartAutomaticSlidingIfAllowed();
        }
    });

    startAutomaticSliding();
}




const millisecondsPerDay = 1000 * 60 * 60 * 24;

function getLocalDayNumber() {
    const today = new Date();

    return Math.floor(
        today.getTime() / millisecondsPerDay
    );
}


fetch("data/articles.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Articles could not be loaded.");
        }

        return response.json();
    })
    .then((articles) => {
        if (!Array.isArray(articles) || articles.length === 0) {
            throw new Error("No articles were found.");
        }

        const articlesContainer = document.getElementById("latest-articles");

        articlesContainer.innerHTML = "";

        const dayNumber = getLocalDayNumber();
        const startingIndex = (dayNumber * 3) % articles.length;
        const dailyArticles = [];

        for (let i = 0; i < 3; i++) {
            const articleIndex = (startingIndex + i) % articles.length;

            dailyArticles.push(articles[articleIndex]);
        }

        dailyArticles.forEach((article) => {
            const articleCard = document.createElement("article");

            articleCard.classList.add("article-card");

            articleCard.innerHTML = `
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}">

                    <span class="article-category">${article.category}</span>

                    <button 
                        class="article-favorite"
                        type="button"
                        data-article-id="${article.id}"
                        aria-label="Add article to favorites">

                        <i
                            class="fa-regular fa-heart"
                            aria-hidden="true"
                        ></i>
                    </button>
                </div>

                <div class="article-content">
                    <div class="article-meta">
                        <span>${article.date}</span>
                        <span>${article.readingTime}</span>
                    </div>

                    <h3>${article.title}</h3>

                    <p class="article-excerpt">${article.excerpt}</p>

                    <a
                        class="read-article-link"
                        href="article.html?id=${article.id}">

                        Read Article
                        <i
                            class="fa-solid fa-arrow-right"
                            aria-hidden="true"
                        ></i>
                    </a>
                </div>
            `;

            articlesContainer.appendChild(articleCard);
        });


        setupArticleFavorites(articles);


        const articleOfDayIndex = (startingIndex + 3) % articles.length;

        const articleOfDay = articles[articleOfDayIndex];

        renderArticleOfDay(articleOfDay);
    })
    .catch((error) => {
        const articlesContainer = document.getElementById("latest-articles");
        const articleOfDayContainer = document.getElementById("article-of-day");

        articlesContainer.innerHTML = `
            <p class="error-message">
                The articles could not be loaded. Please try again.
            </p>
        `;

        articleOfDayContainer.innerHTML = `
            <p class="error-message">
                The article of the day could not be loaded.
            </p>
        `;

        console.error(error);
    });



function setupArticleFavorites(articles) {
    const favoriteButtons = document.querySelectorAll(".article-favorite");

    let favoriteArticles = getStoredFavoriteArticles();

    function updateAllFavoriteButtons() {
        favoriteButtons.forEach((button) => {
            const articleId = Number(button.dataset.articleId);

            const selectedArticle = articles.find((article) => {
                return article.id === articleId;
            });

            if (!selectedArticle) {
                console.error(`Article with ID ${articleId} was not found.`);

                return;
            }

            const isSaved = isArticleFavorite(
                favoriteArticles,
                articleId
            );

            updateArticleFavoriteButton(
                button,
                selectedArticle,
                isSaved
            );
        });
    }

    function refreshArticleFavorites() {
        favoriteArticles = getStoredFavoriteArticles();

        updateAllFavoriteButtons();
    }

    favoriteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const articleId = Number(button.dataset.articleId);

            const selectedArticle = articles.find((article) => {
                return article.id === articleId;
            });

            if (!selectedArticle) {
                return;
            }

            favoriteArticles = toggleArticleFavorite(
                favoriteArticles,
                selectedArticle
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

    refreshArticleFavorites();
}




function renderArticleOfDay(article) {
    const articleOfDayContainer = document.getElementById("article-of-day");

    articleOfDayContainer.innerHTML = `
        <div class="article-of-day-image">
            <img src="${article.image}" alt="${article.title}">

            <span class="featured-badge">Featured</span>
        </div>

        <div class="article-of-day-content">
            <div class="article-day-heading">
                <p>ARTICLE OF THE DAY</p>
            </div>

            <p class="article-day-category">${article.category}</p>

            <h2>${article.title}</h2>

            <div class="article-day-meta">
                <span>${article.date}</span>
                <span>${article.readingTime}</span>
            </div>

            <p class="article-day-description">${article.excerpt}</p>

            <a
                class="article-day-button"
                href="article.html?id=${article.id}">

                Read the Full Story
                <i
                    class="fa-solid fa-arrow-right"
                    aria-hidden="true"
                ></i>
            </a>
        </div>
    `;
}




fetch("data/looks.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Looks could not be loaded.");
        }

        return response.json();
    })
    .then((looks) => {
        if (!Array.isArray(looks) || looks.length === 0) {
            throw new Error("No looks were found.");
        }

        const dayNumber = getLocalDayNumber();
        const dailyLookIndex = dayNumber % looks.length;
        const dailyLook = looks[dailyLookIndex];

        renderDailyLook(dailyLook);
    })
    .catch((error) => {
        const featuredLookContainer = document.getElementById("featured-look");

        featuredLookContainer.innerHTML = `
            <p class="error-message">
                Today's look could not be loaded.
            </p>
        `;

        console.error(error);
    });



function renderDailyLook(look) {
    const featuredLookContainer = document.getElementById("featured-look");

    const hotspotsHTML = look.products.map((product) => {
        return `
            <span
                class="look-hotspot"
                style="top: ${product.hotspotTop}; left: ${product.hotspotLeft};"
                aria-hidden="true">

                ${product.number}
            </span>
        `;
    })
    .join("");

    const productsHTML = look.products.map((product) => {
        return `
            <li class="look-product">
                <span class="product-number">${product.number}</span>

                <div class="product-info">
                    <p class="product-category">${product.category}</p>

                    <h4 class="product-name">
                        ${
                            product.productUrl
                                ? `
                                    <a
                                        href="${product.productUrl}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="product-link">

                                        ${product.name}
                                        <i 
                                            class="fa-solid fa-arrow-up-right-from-square"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                `
                                : product.name
                        }
                    </h4>

                    <p class="product-detail">${product.detail}</p>
                </div>
            </li>
        `;
    })
    .join("");

    featuredLookContainer.innerHTML = `
        <div class="featured-look-image">
            <img src="${look.image}" alt="${look.name}">

            ${hotspotsHTML}
        </div>

        <div class="look-details">
            <p class="look-style">${look.style}</p>

            <h3 class="look-name">${look.name}</h3>

            <p class="look-description">${look.description}</p>

            <ul class="look-products">${productsHTML}</ul>
        </div>
    `;
}