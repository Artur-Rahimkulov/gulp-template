export const validateForms = () => {
  // валидируем только формы с data-validate, чтобы не мешать поиску в шапке
  const forms = document.querySelectorAll("form[data-validate]");
  if (!forms.length) return;

  const getGroup = (field) =>
    field.closest("[data-form-group]") ||
    field.closest("[data-form-group-checkbox]") ||
    field.parentNode;

  forms.forEach((form) => {
    const successBox = form.querySelector("[data-form-success]");

    // =========================
    // CLEAR ERROR
    // =========================
    function clearError(field) {
      const group = getGroup(field);
      group.classList.remove("has-danger");
      const error = group.querySelector(".error-message");
      if (error) error.remove();
    }

    // =========================
    // LIVE EVENTS
    // =========================
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      const onChange = () => {
        clearError(field);
        if (successBox && !successBox.hidden) successBox.hidden = true;
      };
      field.addEventListener("input", onChange);
      field.addEventListener("change", onChange);
    });

    // =========================
    // SUBMIT
    // =========================
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;

      form.querySelectorAll(".error-message").forEach((el) => el.remove());
      form
        .querySelectorAll(".has-danger")
        .forEach((el) => el.classList.remove("has-danger"));

      const fields = form.querySelectorAll("input, textarea, select");

      fields.forEach((field) => {
        const value = field.value.trim();
        const isRequired = field.hasAttribute("required");
        const dataType = field.dataset.type;
        const group = getGroup(field);

        function showError(message, needUI = true) {
          isValid = false;
          group.classList.add("has-danger");

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

        // REQUIRED
        if (isRequired) {
          if (
            (field.type === "checkbox" && !field.checked) ||
            (field.type !== "checkbox" && value === "")
          ) {
            const isCheckbox = field.type === "checkbox";
            showError(
              field.dataset.requiredMessage || "Заполните поле",
              !isCheckbox
            );
            return;
          }
        }

        if (!value) return;

        // TYPE VALIDATION
        switch (dataType) {
          case "email": {
            // маска mail@domen.ru
            const pattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
            if (!pattern.test(value)) {
              showError(field.dataset.errorMessage || "Некорректный email", true);
            }
            break;
          }

          case "phone": {
            const digits = value.replace(/\D/g, "");
            if (digits.length < 11) {
              showError(
                field.dataset.errorMessage || "Некорректный телефон",
                true
              );
            }
            break;
          }

          case "name": {
            const pattern = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,}$/;
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
            if (!/^https?:\/\//i.test(url)) url = "https://" + url;
            try {
              const hostname = new URL(url).hostname;
              if (!/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(hostname)) throw new Error();
            } catch {
              showError(field.dataset.errorMessage || "Некорректный URL", true);
            }
            break;
          }
        }
      });

      if (!isValid) return;

      // =========================
      // SUCCESS
      // =========================
      form.querySelectorAll('[data-type="phone"]').forEach((input) => {
        if (input._imask) input._imask.value = "";
      });
      form.reset();

      if (successBox) {
        successBox.hidden = false;
      } else {
        form.dispatchEvent(new CustomEvent("form-success", { bubbles: true }));
      }
    });
  });
};
