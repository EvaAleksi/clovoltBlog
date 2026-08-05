import {
    getStoredFavoriteLooks,
    isLookFavorite,
    toggleLookFavorite,
    updateLookFavoriteButton
} from "./favorites.js";


const lookDetailContent = document.querySelector(".look-detail-content");

let favoriteLooks = getStoredFavoriteLooks();
let currentLook = null;


async function loadLook() {
    try {
        const urlParameters = new URLSearchParams(window.location.search);

        const lookId = Number(urlParameters.get("id"));

        if (!Number.isInteger(lookId) || lookId <= 0) {
            throw new Error("No look was selected.");
        }

        const response = await fetch("data/looks.json");

        if (!response.ok) {
            throw new Error("The look data could not be loaded.");
        }

        const looks = await response.json();

        if (!Array.isArray(looks)) {
            throw new Error("The look data is not valid.");
        }

        currentLook = looks.find((look) => {
            return look.id === lookId;
        });

        if (!currentLook) {
            throw new Error("The selected look could not be found.");
        }

        renderLook(currentLook);

        document.title = `Clovolt | ${currentLook.name}`;
    } catch (error) {
        console.error(error);

        renderLookNotFound(error.message);
    }
}


function renderLook(look) {
    const products = Array.isArray(look.products)
        ? look.products
        : [];

    const productCount = products.length;

    const metaMarkup = createLookMeta(look, productCount);

    const hotspotsMarkup = products.map((product) => {
        const hotspotTop = product.hotspotTop || "50%";
        const hotspotLeft = product.hotspotLeft || "50%";

        return `
            <button
                class="look-hotspot"
                type="button"
                data-product-number="${product.number}"
                style="
                    --hotspot-top: ${hotspotTop};
                    --hotspot-left: ${hotspotLeft};
                "
                aria-label="View product ${product.number}: ${product.name}">

                ${product.number}
            </button>
        `;
    })
    .join("");

    const productsMarkup = products.length > 0
        ? products.map((product) => {
            return createProductCard(product);
        })
        .join("")
        : `
            <p class="look-no-products">
                No products are available for this look.
            </p>
        `;

    lookDetailContent.innerHTML = `
        <article class="look-detail">
            <header class="look-detail-header">
                <p class="look-detail-style">
                    ${look.style}
                </p>

                <h1 class="look-detail-title">
                    ${look.name}
                </h1>

                <div
                    class="look-title-line"
                    aria-hidden="true">
                </div>

                <p class="look-detail-description">
                    ${look.description}
                </p>

                <div class="look-detail-meta">
                    ${metaMarkup}
                </div>

                <button
                    class="look-save-button"
                    type="button"
                    aria-label="Add ${look.name} to favorites"
                    aria-pressed="false">

                    <i
                        class="fa-regular fa-heart"
                        aria-hidden="true">
                    </i>
                </button>
            </header>

            <hr class="look-detail-divider">

            <div class="look-showcase">
                <section
                    class="look-image-column"
                    aria-labelledby="complete-look-heading">

                    <h2
                        class="look-column-heading"
                        id="complete-look-heading">

                        Complete Look
                    </h2>

                    <div class="look-image-panel">
                        <figure class="look-image-container">
                            <img
                                class="look-main-image"
                                src="${look.image}"
                                alt="${look.name}"
                            >

                            ${hotspotsMarkup}
                        </figure>
                    </div>
                </section>

                <section
                    class="look-products-column"
                    aria-labelledby="shop-pieces-heading">

                    <div class="look-product-heading-row">
                        <h2
                            class="look-column-heading"
                            id="shop-pieces-heading">

                            Shop the Pieces
                        </h2>
                    </div>

                    <div class="look-products-scroll">
                        <div
                            class="look-products-list"
                            role="list">

                            ${productsMarkup}
                        </div>
                    </div>
                </section>
            </div>
        </article>
    `;

    setupFavoriteButton(look);
    setupHotspotInteractions();
    setupProductListHeight();
}


function createLookMeta(look, productCount) {
    const metaItems = [
        `Style: ${look.style}`,
        look.season ? `Season: ${look.season}` : "",
        `${productCount} ${productCount === 1 ? "product" : "products"}`
    ]
    .filter((item) => {
        return item !== "";
    });

    return metaItems.map((item, index) => {
        const separator = index > 0
            ? `<span aria-hidden="true">•</span>`
            : "";

        return `
            ${separator}

            <span>${item}</span>
        `;
    })
    .join("");
}


function createProductCard(product) {
    const productAction = `
        <a
            class="look-product-link"
            href="${product.productUrl || ""}"
            target="_blank"
            rel="noopener noreferrer">

            View Product

            <i
                class="fa-solid fa-arrow-up-right-from-square"
                aria-hidden="true">
            </i>
        </a>
    `;

    return `
        <article
            class="look-product-card"
            data-product-number="${product.number}"
            role="listitem"
            tabindex="-1">

            <div class="look-product-header">
                <span class="look-product-number">
                    ${product.number}
                </span>

                <div class="look-product-info">
                    <p class="look-product-category">
                        ${product.category}
                    </p>

                    <h3 class="look-product-name">
                        ${product.name}
                    </h3>
                </div>
            </div>

            <p class="look-product-detail">
                ${product.detail}
            </p>

            ${productAction}
        </article>
    `;
}


function setupFavoriteButton(look) {
    const favoriteButton = lookDetailContent.querySelector(
        ".look-save-button"
    );

    updateCurrentLookFavoriteButton();

    favoriteButton.addEventListener("click", () => {
        favoriteLooks = toggleLookFavorite(
            favoriteLooks,
            look
        );

        updateCurrentLookFavoriteButton();
    });
}


function updateCurrentLookFavoriteButton() {
    if (!currentLook) {
        return;
    }

    favoriteLooks = getStoredFavoriteLooks();

    const favoriteButton = lookDetailContent.querySelector(
        ".look-save-button"
    );

    if (!favoriteButton) {
        return;
    }

    const isSaved = isLookFavorite(
        favoriteLooks,
        currentLook.id
    );

    updateLookFavoriteButton(
        favoriteButton,
        currentLook,
        isSaved
    );
}


function setupHotspotInteractions() {
    const hotspotButtons = lookDetailContent.querySelectorAll(
        ".look-hotspot"
    );

    const productCards = lookDetailContent.querySelectorAll(
        ".look-product-card"
    );

    if (hotspotButtons.length === 0) {
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    )
    .matches;

    hotspotButtons.forEach((hotspotButton) => {
        hotspotButton.addEventListener("click", () => {
            const productNumber =
                hotspotButton.dataset.productNumber;

            const selectedProduct = lookDetailContent.querySelector(
                `.look-product-card[data-product-number="${productNumber}"]`
            );

            if (!selectedProduct) {
                return;
            }

            hotspotButtons.forEach((button) => {
                button.classList.remove("active");
            });

            productCards.forEach((productCard) => {
                productCard.classList.remove("highlighted");
            });

            hotspotButton.classList.add("active");
            selectedProduct.classList.add("highlighted");

            selectedProduct.scrollIntoView({
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth",
                block: "nearest"
            });

            selectedProduct.focus({
                preventScroll: true
            });
        });
    });
}


function setupProductListHeight() {
    const imageContainer = lookDetailContent.querySelector(
        ".look-image-container"
    );

    const lookImage = lookDetailContent.querySelector(
        ".look-main-image"
    );

    const productsScroll = lookDetailContent.querySelector(
        ".look-products-scroll"
    );

    if (!imageContainer || !lookImage || !productsScroll) {
        return;
    }

    function updateProductListHeight() {
        const isTabletOrMobile = window.matchMedia(
            "(max-width: 900px)"
        )
        .matches;

        if (isTabletOrMobile) {
            productsScroll.style.maxHeight = "none";

            return;
        }

        productsScroll.style.maxHeight =
            `${imageContainer.offsetHeight}px`;
    }

    if (lookImage.complete) {
        updateProductListHeight();
    } else {
        lookImage.addEventListener(
            "load",
            updateProductListHeight
        );
    }

    window.addEventListener(
        "resize",
        updateProductListHeight
    );

    if ("ResizeObserver" in window) {
        const imageResizeObserver = new ResizeObserver(() => {
            updateProductListHeight();
        });

        imageResizeObserver.observe(imageContainer);
    }
}


function renderLookNotFound(message) {
    document.title = "Clovolt | Look Not Found";

    lookDetailContent.innerHTML = `
        <section class="look-not-found">
            <i
                class="fa-regular fa-face-frown look-not-found-icon"
                aria-hidden="true">
            </i>

            <h1>Look Not Found</h1>

            <p>
                ${message}
                Please return to Shop the Look and choose another outfit.
            </p>

            <a
                class="look-not-found-link"
                href="shop-the-look.html">

                <i
                    class="fa-solid fa-arrow-left"
                    aria-hidden="true">
                </i>

                Back to Shop the Look
            </a>
        </section>
    `;
}


window.addEventListener("pageshow", () => {
    updateCurrentLookFavoriteButton();
});


window.addEventListener("storage", (event) => {
    if (event.key === "favoriteLooks") {
        updateCurrentLookFavoriteButton();
    }
});


loadLook();