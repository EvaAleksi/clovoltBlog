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


function startAutomaticSliding() {
    clearInterval(automaticSlideInterval);
    
    automaticSlideInterval = setInterval(() => {
        const nextSlideIndex = (currentSlideIndex + 1) % carouselSlides.length;

        showSlide(nextSlideIndex);
    }, 3000);
}


function stopAutomaticSliding() {
    clearInterval(automaticSlideInterval);
}

heroCarousel.addEventListener(
    "mouseenter",
    stopAutomaticSliding
);

heroCarousel.addEventListener(
    "mouseleave",
    startAutomaticSliding
);

startAutomaticSliding();



fetch("data/articles.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Articles could not be loaded.");
        }

        return response.json();
    })
    .then((articles) => {
        const articlesContainer = document.getElementById("latest-articles");

        articlesContainer.innerHTML = "";

        const today = new Date();

        const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

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
                    <img
                        src="${article.image}"
                        alt="${article.title}"
                    >

                    <span class="article-category">
                        ${article.category}
                    </span>

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

                    <p class="article-excerpt">
                        ${article.excerpt}
                    </p>

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

    let favoriteArticles = JSON.parse(
        localStorage.getItem("favoriteArticles")
    ) || [];

    favoriteButtons.forEach((button) => {
        const articleId = Number(button.dataset.articleId);

        const isAlreadySaved = favoriteArticles.some(
            (favoriteArticle) => {
                return favoriteArticle.id === articleId;
            }
        );

        updateFavoriteButton(button, isAlreadySaved);

        button.addEventListener("click", () => {
            const selectedArticle = articles.find(
                (article) => {
                    return article.id === articleId;
                }
            );

            const isSaved = favoriteArticles.some(
                (favoriteArticle) => {
                    return favoriteArticle.id === articleId;
                }
            );

            if (isSaved) {
                favoriteArticles = favoriteArticles.filter(
                    (favoriteArticle) => {
                        return favoriteArticle.id !== articleId;
                    }
                );

                updateFavoriteButton(button, false);
            } else {
                favoriteArticles.push(selectedArticle);

                updateFavoriteButton(button, true);
            }

            localStorage.setItem(
                "favoriteArticles",
                JSON.stringify(favoriteArticles)
            );
        });
    });
}


function updateFavoriteButton(button, isSaved) {
    const heartIcon = button.querySelector("i");

    if (isSaved) {
        button.classList.add("saved");

        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");

        button.setAttribute(
            "aria-label",
            "Remove article from favorites"
        );
    } else {
        button.classList.remove("saved");

        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");

        button.setAttribute(
            "aria-label",
            "Add article to favorites"
        );
    }
}



function renderArticleOfDay(article) {
    const articleOfDayContainer = document.getElementById("article-of-day");

    articleOfDayContainer.innerHTML = `
        <div class="article-of-day-image">
            <img
                src="${article.image}"
                alt="${article.title}"
            >

            <span class="featured-badge">Featured</span>
        </div>

        <div class="article-of-day-content">
            <div class="article-day-heading">
                <span></span>
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

        const today = new Date();

        const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

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
                aria-label="${product.name}">

                ${product.number}
            </span>
        `;
    })
    .join("");

    const productsHTML = look.products.map((product) => {
        return `
            <li class="look-product">
                <span class="product-number">
                    ${product.number}
                </span>

                <div class="product-info">
                    <p class="product-category">
                        ${product.category}
                    </p>

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
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </a>
                                `
                                : product.name
                        }
                    </h4>

                    <p class="product-detail">
                        ${product.detail}
                    </p>
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