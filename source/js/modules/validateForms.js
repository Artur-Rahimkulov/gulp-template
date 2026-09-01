export const validateForms = () => {
  const forms = document.querySelectorAll("form");
  if (!forms.length) return;

  forms.forEach(form => {

    // =========================
    // CLEAR ERROR
    // =========================
    function clearError(field) {
      const group =
          field.closest("[data-form-group]") ||
          field.closest("[data-form-group-checkbox]") ||
          field.parentNode;

      group.classList.remove("has-danger");

      const error = group.querySelector(".error-message");
      if (error) error.remove();
    }

    // =========================
    // LIVE EVENTS
    // =========================
    form.querySelectorAll("input, textarea").forEach(field => {
      field.addEventListener("input", () => clearError(field));
      field.addEventListener("change", () => clearError(field));
    });

    // =========================
    // SUBMIT
    // =========================
    form.addEventListener("submit", function (e) {
      let isValid = true;

      // очистка перед проверкой
      form.querySelectorAll(".error-message").forEach(el => el.remove());
      form.querySelectorAll(".has-danger").forEach(el => el.classList.remove("has-danger"));

      const fields = form.querySelectorAll("input, textarea");

      fields.forEach(field => {
        const value = field.value.trim();
        const isRequired = field.hasAttribute("required");
        const dataType = field.dataset.type;

        const group =
            field.closest("[data-form-group]") ||
            field.closest("[data-form-group-checkbox]") ||
            field.parentNode;

        function showError(message, needUI = true) {
          isValid = false;

          group.classList.add("has-danger");

          // 👉 текст ошибки
          if (needUI) {
            let error = group.querySelector(".error-message");

            if (!error) {
              error = document.createElement("div");
              error.className = "error-message";
              group.appendChild(error);
            }

            error.textContent = message;
          }
        }

        // =========================
        // REQUIRED
        // =========================
        if (isRequired) {
          if (
              (field.type === "checkbox" && !field.checked) ||
              (field.type !== "checkbox" && value === "")
          ) {
            // ❗ чекбокс без текста
            const isCheckbox = field.type === "checkbox";

            showError(
                field.dataset.requiredMessage || "Заполните поле",
                !isCheckbox // текст не показываем для checkbox
            );

            return;
          }
        }

        // если пусто — дальше не валидируем
        if (!value) return;

        // =========================
        // TYPE VALIDATION
        // =========================
        switch (dataType) {
          case "email": {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!pattern.test(value)) {
              showError(
                  field.dataset.errorMessage || "Некорректный email",
                  true
              );
            }
            break;
          }

          case "phone": {
            const digits = value.replace(/\D/g, "");
            const pattern = /^[0-9+\-\s()]+$/;

            if (!pattern.test(value) || digits.length < 11) {
              showError(
                  field.dataset.errorMessage || "Некорректный телефон",
                  true
              );
            }
            break;
          }

          case "name": {
            const pattern = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,}$/;

            if (!pattern.test(value)) {
              showError(
                  field.dataset.errorMessage || "Введите корректное имя",
                  true
              );
            }
            break;
          }

          case "url": {
            let url = value;

            if (!/^https?:\/\//i.test(url)) {
              url = "https://" + url;
            }

            try {
              const parsed = new URL(url);
              const hostname = parsed.hostname;

              const isValidDomain =
                  hostname.includes(".") &&
                  !hostname.startsWith(".") &&
                  !hostname.endsWith(".") &&
                  /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(hostname);

              if (!isValidDomain) throw new Error();
            } catch {
              showError(
                  field.dataset.errorMessage || "Некорректный URL",
                  true
              );
            }
            break;
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });
};