fetch("components/footer.html")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Footer file was not found.");
        }

        return response.text();
    })
    .then((footerHTML) => {
        const footerContainer = document.getElementById("footer-container");
        footerContainer.innerHTML = footerHTML;

        const currentYear = footerContainer.querySelector("#current-year");

        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }

        const footerNavigationLinks = footerContainer.querySelectorAll("nav a");

        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        footerNavigationLinks.forEach((link) => {
            const linkPage = link.getAttribute("href").split("/").pop();

            if (linkPage === currentPage) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    })
    .catch((error) => {
        console.error("Footer could not be loaded:", error);
    });