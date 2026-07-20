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
                        aria-label="Add ${article.title} to favorites">

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
    })
    .catch((error) => {
        const articlesContainer = document.getElementById("latest-articles");

        articlesContainer.innerHTML = `
            <p class="error-message">
                The articles could not be loaded. Please try again.
            </p>
        `;

        console.error(error);
    });