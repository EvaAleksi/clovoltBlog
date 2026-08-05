fetch("components/header.html")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Header file was not found.");
        }

        return response.text();
    })
    .then((headerHTML) => {
        const headerContainer = document.getElementById("header-container");
        headerContainer.innerHTML = headerHTML;

        const menuButton = document.getElementById("menu-button");
        const navigationMenu = document.getElementById("navigation-menu");
        const menuIcon = menuButton.querySelector("i");

        function closeMenu() {
            navigationMenu.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }

        menuButton.addEventListener("click", () => {
            const menuIsOpen = navigationMenu.classList.toggle("open");
            
            menuButton.setAttribute("aria-expanded", menuIsOpen);

            if (menuIsOpen) {
                menuButton.setAttribute("aria-label", "Close navigation menu");

                menuIcon.classList.remove("fa-bars");
                menuIcon.classList.add("fa-xmark");
            } else {
                menuButton.setAttribute("aria-label", "Open navigation menu");

                menuIcon.classList.remove("fa-xmark");
                menuIcon.classList.add("fa-bars");
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && navigationMenu.classList.contains("open")) {
                closeMenu();
                menuButton.focus();
            }
        });

        const navigationLinks = navigationMenu.querySelectorAll("a");

        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        navigationLinks.forEach((link) => {
            const linkPage = link.getAttribute("href").split("/").pop();

            if (linkPage === currentPage) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }

            link.addEventListener("click", closeMenu);
        });
    })
    .catch((error) => {
        console.error("Header could not be loaded:", error);
    });