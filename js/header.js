fetch("components/header.html")
    .then((response) => {
        if(!response.ok) {
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

        menuButton.addEventListener("click", () => {
            const menuIsOpen = navigationMenu.classList.toggle("open");
            
            menuButton.setAttribute(
                "aria-expanded",
                menuIsOpen
            );

            if (menuIsOpen) {
                menuButton.setAttribute(
                    "aria-label",
                    "Close navigation menu"
                );
                menuIcon.classList.remove("fa-bars");
                menuIcon.classList.add("fa-xmark");
            } else {
                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
                menuIcon.classList.remove("fa-xmark");
                menuIcon.classList.add("fa-bars");
            }
        });
    })
    .catch((error) => {
        console.error("Header could not be loaded:", error);
    });