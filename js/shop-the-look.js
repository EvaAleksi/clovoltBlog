import { getStoredFavoriteLooks, isLookFavorite, toggleLookFavorite, updateLookFavoriteButton } from "./favorites.js";

const looksGrid = document.querySelector("#shop-look-grid");
const searchInput = document.querySelector("#shop-search-input");
const searchForm = document.querySelector("#shop-search-form");
const styleFilters = document.querySelectorAll(".shop-style-filter");
const looksResultCount = document.querySelector("#shop-results-count");
const noResultMessage = document.querySelector("#shop-no-results");
const loadMoreButton = document.querySelector("#shop-load-more-button");
const loadMoreContainer = document.querySelector(".shop-load-more-container");

const initialVisibleLookCount = 4;
const looksPerLoad = 4;

let allLooks = [];
let filteredLooks = [];
let visibleLookCount = initialVisibleLookCount;
let activeStyle = "all";
let favoriteLooks = getStoredFavoriteLooks();


async function loadLooks() {
    try {
        const response = await fetch("data/looks.json");

        if (!response.ok) {
            throw new Error("Looks could not be loaded.");
        }

        allLooks = await response.json();

        if (!Array.isArray(allLooks) || allLooks.length === 0) {
            throw new Error("No looks were found.");
        }

        applyLookFilters();
    } catch (error) {
        console.error(error);

        looksGrid.innerHTML = `
            <p class="error-message">
                Looks could not be loaded. Please try again later.
            </p>
        `;
    }
}


function createLookCard(look) {
    const isSaved = isLookFavorite(favoriteLooks, look.id);

    const favoriteLabel = isSaved
        ? `Remove ${look.name} from favorites`
        : `Add ${look.name} to favorites`;

    const heartClass = isSaved ? "fa-solid" : "fa-regular";

    return `
        <article class="shop-look-card">
            <a
                href="look.html?id=${look.id}"
                class="shop-look-link">

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
                aria-label="${favoriteLabel}"
                aria-pressed="${isSaved}">

                <i
                    class="${heartClass} fa-heart"
                    aria-hidden="true">
                </i>
            </button>
        </article>
    `;
}


function renderLooks() {
    const visibleLooks = filteredLooks.slice(0, visibleLookCount);

    looksGrid.innerHTML = visibleLooks.map((look) => {
        return createLookCard(look);
    })
    .join("");

    const displayedLookCount = visibleLooks.length;
    const totalLookCount = filteredLooks.length;

    looksResultCount.textContent = totalLookCount === 0
        ? "No looks found"
        : `Showing ${displayedLookCount} of ${totalLookCount} looks`;

    noResultMessage.hidden = totalLookCount !== 0;

    const hasExpandableLooks = totalLookCount > initialVisibleLookCount;

    if (!hasExpandableLooks) {
        loadMoreContainer.hidden = true;
        loadMoreButton.textContent = "Load More";
        loadMoreButton.setAttribute("aria-label", "Show more looks");

        return;
    }

    loadMoreContainer.hidden = false;

    const isShowingAll = displayedLookCount >= totalLookCount;

    loadMoreButton.textContent = isShowingAll ? "Show Less" : "Load More";

    loadMoreButton.setAttribute(
        "aria-label",
        isShowingAll ? "Show fewer looks" : "Show more looks"
    );
}


function applyLookFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    filteredLooks = allLooks.filter((look) => {
        const searchableLookText = `
            ${look.name || ""}
            ${look.style || ""}
            ${look.description || ""}
        `.toLowerCase();

        const lookStyle = String(look.style || "").toLowerCase();

        const matchesStyle =
            activeStyle === "all" ||
            lookStyle === activeStyle.toLowerCase();

        const matchesSearch =
            searchableLookText.includes(searchTerm);

        return matchesStyle && matchesSearch;
    });

    visibleLookCount = initialVisibleLookCount;

    renderLooks();
}


function selectStyle(selectedButton) {
    activeStyle = selectedButton.dataset.style;

    styleFilters.forEach((button) => {
        const isActive = button === selectedButton;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}


styleFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
        selectStyle(filterButton);

        applyLookFilters();
    });
});


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    applyLookFilters();
});


searchInput.addEventListener("input", () => {
    applyLookFilters();
});


looksGrid.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest(".shop-favorite-button");

    if (!favoriteButton) {
        return;
    }

    const lookId = Number(favoriteButton.dataset.lookId);

    const selectedLook = allLooks.find((look) => {
        return look.id === lookId;
    });

    if (!selectedLook) {
        return;
    }

    favoriteLooks = toggleLookFavorite(
        favoriteLooks,
        selectedLook
    );

    const isSaved = isLookFavorite(favoriteLooks, lookId);

    updateLookFavoriteButton(
        favoriteButton,
        selectedLook,
        isSaved
    );
});


loadMoreButton.addEventListener("click", () => {
    const isShowingAll = visibleLookCount >= filteredLooks.length;

    if (isShowingAll) {
        visibleLookCount = initialVisibleLookCount;
    } else {
        visibleLookCount = Math.min(
            visibleLookCount + looksPerLoad,
            filteredLooks.length
        );
    }

    renderLooks();
});


function refreshLookFavorites() {
    favoriteLooks = getStoredFavoriteLooks();

    if (allLooks.length > 0) {
        renderLooks();
    }
}


window.addEventListener("pageshow", () => {
    refreshLookFavorites();
});


window.addEventListener("storage", (event) => {
    if (event.key === "favoriteLooks") {
        refreshLookFavorites();
    }
});


loadLooks();