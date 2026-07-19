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