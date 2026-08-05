const contactForm = document.getElementById("contact-form");


if (contactForm) {
    const contactFields = Array.from(
        contactForm.querySelectorAll("input, textarea")
    );

    const submitButton = document.getElementById("contact-submit-button");
    const submitButtonText = document.getElementById("contact-submit-text");
    const formStatus = document.getElementById("contact-form-status");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function getFieldError(field) {
        const fieldValue = field.value.trim();

        if (!fieldValue) {
            switch (field.name) {
                case "name":
                    return "Please enter your name.";

                case "email":
                    return "Please enter your email address.";

                case "subject":
                    return "Please enter a subject.";

                case "message":
                    return "Please write your message.";

                default:
                    return "This field is required.";
            }
        }

        if (field.type === "email" && !emailPattern.test(fieldValue)) {
            return "Please enter a valid email address.";
        }

        return "";
    }

    function showFieldError(field, errorMessage) {
        const fieldContainer = field.closest(".contact-form-field");
        const errorElement = document.getElementById(`${field.id}-error`);

        fieldContainer.classList.add("has-error");
        field.setAttribute("aria-invalid", "true");
        errorElement.textContent = errorMessage;
    }

    function clearFieldError(field) {
        const fieldContainer = field.closest(".contact-form-field");
        const errorElement = document.getElementById(`${field.id}-error`);

        fieldContainer.classList.remove("has-error");
        field.setAttribute("aria-invalid", "false");
        errorElement.textContent = "";
    }

    function validateField(field) {
        const errorMessage = getFieldError(field);

        if (errorMessage) {
            showFieldError(field, errorMessage);
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function showFormStatus(message, statusType) {
        formStatus.textContent = message;
        formStatus.className = "contact-form-status";
        formStatus.classList.add(statusType);
        formStatus.hidden = false;
    }

    function hideFormStatus() {
        formStatus.textContent = "";
        formStatus.className = "contact-form-status";
        formStatus.hidden = true;
    }

    contactFields.forEach((field) => {
        field.addEventListener("blur", () => {
            validateField(field);
        });

        field.addEventListener("input", () => {
            const fieldIsInvalid =
                field.getAttribute("aria-invalid") === "true";

            if (fieldIsInvalid) {
                validateField(field);
            }

            if (!formStatus.hidden) {
                hideFormStatus();
            }
        });
    });

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fieldValidationResults = contactFields.map((field) => {
            return validateField(field);
        });

        const formIsValid = fieldValidationResults.every((result) => {
            return result;
        });

        if (!formIsValid) {
            const firstInvalidField = contactFields.find((field) => {
                return field.getAttribute("aria-invalid") === "true";
            });

            showFormStatus(
                "Please correct the highlighted fields before sending your message.",
                "error"
            );

            firstInvalidField?.focus();
            return;
        }

        contactForm.setAttribute("aria-busy", "true");
        submitButton.disabled = true;
        submitButtonText.textContent = "Sending...";

        showFormStatus("Sending your message...", "sending");

        try {
            await new Promise((resolve) => {
                window.setTimeout(resolve, 900);
            });

            contactForm.reset();

            contactFields.forEach((field) => {
                clearFieldError(field);
            });

            showFormStatus(
                "Thank you! Your message has been submitted successfully.",
                "success"
            );
        } catch (error) {
            console.error("The contact form could not be submitted:", error);

            showFormStatus(
                "Your message could not be sent. Please try again.",
                "error"
            );
        } finally {
            contactForm.removeAttribute("aria-busy");
            submitButton.disabled = false;
            submitButtonText.textContent = "Send Message";
        }
    });
}