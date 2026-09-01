export const select = () => {
	const selectClose = (select, option) => {
		select.classList.remove("is-open");

		if (option) {
			option.classList.add("is-selected");

			const input = select.querySelector("input");
			if (input) {
				// Устанавливаем новое значение
				input.setAttribute("value", option.getAttribute("data-value"));
			}
		}
	};

	document.body.addEventListener("click", (e) => {
		const selectActive = document.querySelector(
			'[data-select="select"].is-open'
		);

		if (selectActive) {
			selectActive.classList.remove("is-open");
		}

		if (e.target.getAttribute("data-select") == "button") {
			var select = e.target.closest('[data-select="select"]');

			if (select === selectActive) {
				select.classList.remove("is-open");
			} else {
				select.classList.add("is-open");
			}

			const optionList = select.querySelector('[data-select="options"]');
			const optionItems = select.querySelectorAll('[data-select="option"]');

			optionItems.forEach((option) => {
				option.addEventListener("click", () => {
					const optionSelected = optionList.querySelector(".is-selected");
					if (optionSelected && optionSelected !== option) {
						optionSelected.classList.remove("is-selected");
					}

					selectClose(select, option);
					select.querySelector("span").innerHTML = option.innerHTML;
				});
			});
		}
	});
};
