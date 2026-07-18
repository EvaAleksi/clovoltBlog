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
    })
    .catch((error) => {
        console.error("Footer could not be loaded:", error);
    });