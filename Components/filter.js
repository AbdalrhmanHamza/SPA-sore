function Filter() {
  let MIN = 0;
  let MAX = 1599;

  const Url = new URL(window.location.href);
  let paramMinPrice = +Url.searchParams.get("min") || MIN;
  let paramMaxPrice = +Url.searchParams.get("max") || MAX;
  if (
    paramMinPrice < MIN ||
    paramMinPrice > MAX ||
    paramMinPrice > paramMaxPrice
  ) {
    paramMinPrice = MIN; // Reset to minimum if invalid
  }
  if (
    paramMaxPrice < MIN ||
    paramMaxPrice > MAX ||
    paramMaxPrice < paramMinPrice
  ) {
    paramMaxPrice = MAX; // Reset to maximum if invalid
  }

  let currentMinPrice = +paramMinPrice;
  let currentMaxPrice = +paramMaxPrice;
  let filters = {
    category: Url.searchParams.get("category") || "all", // Default category
    style: Url.searchParams.get("style") || "all", // Default style
    min: currentMinPrice,
    max: currentMaxPrice,
  };

  const filtersContainer = document.querySelector(".filters-container");
  const filterBtn = document.querySelector(".filter-item-btn");

  const categorySelectors =
    filtersContainer.querySelectorAll(".category-selector");

  let synced = false;

  filterBtn.addEventListener("click", () => {
    filtersContainer.classList.toggle("hidden");
    // syncInputSlider();
    setTimeout(() => {
      if (!filtersContainer.classList.contains("hidden")) {
        if (!synced) {
          syncInputSlider();
          synced = true;
        }
        filtersContainer.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 210);
  });

  const selectedIcon = document.createElement("i");
  selectedIcon.classList.add("fa-regular", "fa-check", "selected");

  // submit filters
  const submitBtn = filtersContainer.querySelector(".filter-submit-btn");

  submitBtn.addEventListener("click", (e) => {
    // e.preventDefault();
    filters.min = currentMinPrice;
    filters.max = currentMaxPrice;

    Object.keys(filters).forEach((key) => {
      Url.searchParams.set(key, filters[key]); // Update URL with filters
    });
    history.pushState(null, "", Url.pathname + Url.search); // Update the URL without reloading the page
    window.dispatchEvent(new Event("filterUpdated"));
  });

  categorySelectors.forEach((selector) => {
    const selectBtn = selector.querySelector(".category-select");
    const selectedCategory = selectBtn.querySelector(".select-category");
    const list = selector.querySelector(".category-list");
    const ncategoryItems = selector.querySelectorAll(".category-item");
    const categoryItems = Array.from(ncategoryItems);
    let currentItem = null;

    selectBtn.addEventListener("click", () => {
      list.classList.toggle("hidden");
    });

    if (currentItem === null) {
      const filterType = filters[selector.dataset.type];
      currentItem =
        categoryItems.filter((item) => {
          return item.textContent.toLowerCase() == filterType.toLowerCase();
        })[0] || categoryItems[0]; // Default to first item if not found
      currentItem.appendChild(selectedIcon.cloneNode(true));
      currentItem.classList.add("active");
      selectedCategory.textContent = currentItem.textContent;
    }

    // selected icon to be appended to the selected item
    categoryItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (item === currentItem) {
          list.classList.add("hidden");
          return;
        }
        selectedCategory.textContent = item.textContent;
        if (currentItem) {
          currentItem.classList.remove("active");
          currentItem.removeChild(currentItem.querySelector(".selected")); // Remove the selected icon from the previous item
        }
        item.classList.add("active");
        currentItem = item;
        item.appendChild(selectedIcon.cloneNode(true));
        list.classList.add("hidden");
        // Update filters object
        filters[selector.dataset.type] = item.textContent.toLowerCase();
      });
    });
  });

  // Price range

  const priceRange = document.querySelector(".price-range-slider");
  const priceRangeSlider = document.querySelector(".range-price-container");
  const minPrice = document.querySelector(".min-price");
  const maxPrice = document.querySelector(".max-price");
  const errorMessage = filtersContainer.querySelectorAll(".error-msg");

  let isDraggingMin = false;
  let isDraggingMax = false;

  // Helper function to constrain values within bounds
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Start dragging
  minPrice.addEventListener("mousedown", (e) => {
    isDraggingMin = true;
  });

  maxPrice.addEventListener("mousedown", (e) => {
    isDraggingMax = true;
  });

  document.addEventListener("mouseup", () => {
    isDraggingMin = false;
    isDraggingMax = false;
    document.body.classList.remove("no-select"); // Re-enable text selection
  });

  minPrice.addEventListener("touchstart", (e) => {
    isDraggingMin = true;
    e.preventDefault(); // Prevent scrolling while dragging
  });

  maxPrice.addEventListener("touchstart", (e) => {
    isDraggingMax = true;
    e.preventDefault(); // Prevent scrolling while dragging
  });

  document.addEventListener("touchend", () => {
    isDraggingMin = false;
    isDraggingMax = false;
    document.body.classList.remove("no-select"); // Re-enable text selection
  });

  // Dragging logic
  document.addEventListener("mousemove", (e) => {
    if (isDraggingMin || isDraggingMax) {
      e.preventDefault(); // Prevent default behavior to avoid text selection
      handlePriceChange(e);
    }
  });

  document.addEventListener("touchmove", (e) => {
    if (isDraggingMin || isDraggingMax) {
      if (e.touches.length === 0) return; // Ensure there is at least one touch point
      e.preventDefault(); // Prevent default behavior to avoid scrolling
      const touch = e.touches[0]; // Get the first touch point
      handlePriceChange(touch); // Pass the touch event to the function
    }
  });

  const MinLabel = minPrice.querySelector(".price-value");
  const MaxLabel = maxPrice.querySelector(".price-value");

  function handlePriceChange(e) {
    document.body.classList.add("no-select"); // Prevent text selection while dragging
    const pexelsToPriceRatio =
      (MAX - MIN) / priceRange.getBoundingClientRect().width;
    const priceRangeRect = priceRange.getBoundingClientRect(); // Recalculate rect in case of window resize
    const minOffset = priceRangeSlider.offsetLeft + minPrice.offsetWidth;
    const maxOffset =
      priceRangeSlider.offsetLeft + priceRangeSlider.offsetWidth - 15;
    const mouseX = e.clientX - priceRangeRect.left; // Get relative X position
    const rangeWidth = priceRangeRect.width;

    if (isDraggingMin) {
      const left = clamp(mouseX, 0, maxOffset - 15);
      priceRangeSlider.style.left = `${left}px`; // Update slider's left position
      const price = Math.round(left * pexelsToPriceRatio + MIN);
      MinLabel.textContent = `$ ${price}`; // Update min price label
      currentMinPrice = price; // Update current min price
      syncInputSlider(true, false);
      errorMessage.forEach((msg) => {
        msg.textContent = ""; // Clear error messages
      });
    }

    if (isDraggingMax) {
      const right = rangeWidth - clamp(mouseX, minOffset, rangeWidth);
      priceRangeSlider.style.right = `${right}px`; // Update slider's right position
      const price = Math.round((rangeWidth - right) * pexelsToPriceRatio + MIN);
      MaxLabel.textContent = `$ ${price}`; // Update max price label
      const MaxLabelRect = MaxLabel.getBoundingClientRect();
      currentMaxPrice = price; // Update current max price
      syncInputSlider(true, false);
      errorMessage.forEach((msg) => {
        msg.textContent = ""; // Clear error messages
      });
    }
  }

  // price input
  const priceInputs = filtersContainer.querySelectorAll(".price-input");

  const Format = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  priceInputs.forEach((input) => {
    input.addEventListener("focus", (e) => {
      e.target.select(); // Select the input value on focus
    });
    // Filter input to allow only numbers and decimal points
    input.addEventListener("input", (e) => {
      const filteredValue = e.target.value.replace(/[^0-9.]/g, "");
      e.target.value = filteredValue;
    });
    // Handle input change on blur
    input.addEventListener("blur", (e) => {
      const value = e.target.value.replace(/[^0-9.]/g, "");
      if (value === "") {
        e.target.value = "";
        return;
      }
      if (e.target.classList.contains("min-price-input")) {
        checkError(+value, true);
      } else {
        checkError(+value, false, true);
      }
      syncInputSlider(false, true);
    });
  });

  //   check this function
  function checkError(value, min = false, max = false) {
    const minPriceInput = priceInputs[0];
    const maxPriceInput = priceInputs[1];

    errorMessage.forEach((msg) => {
      msg.textContent = ""; // Clear previous error messages
    });

    if (min) {
      if (value < MIN || value > currentMaxPrice || value > MAX) {
        minPriceInput.value = `$ ${Format(currentMinPrice)}`; // Reset to minimum value
        errorMessage[0].textContent = `Minimum price must be between $${MIN} and $${currentMaxPrice}.`;
      } else {
        currentMinPrice = value; // Update current min price
        minPriceInput.value = `$ ${Format(currentMinPrice)}`; // Update input value
      }
    } else if (max) {
      if (value < currentMinPrice || value > MAX) {
        maxPriceInput.value = `$ ${currentMaxPrice}`; // Reset to maximum value
        errorMessage[1].textContent = `Maximum price must be between $${currentMinPrice} and $${MAX}.`;
      } else {
        currentMaxPrice = value; // Update current max price
        maxPriceInput.value = `$ ${Format(currentMaxPrice)}`; // Update input value
      }
    }
  }

  function initializePriceRange() {
    const priceRangeRect = priceRange.getBoundingClientRect();

    const PexelsToPriceRatio = priceRangeRect.width / (MAX - MIN);
    const left = PexelsToPriceRatio * currentMinPrice;
    const right = priceRangeRect.width - PexelsToPriceRatio * currentMaxPrice;
    MinLabel.textContent = `$ ${currentMinPrice}`; // Set initial min price label
    MaxLabel.textContent = `$ ${currentMaxPrice}`; // Set initial max price label
    priceRangeSlider.style.left = `${left}px`;
    priceRangeSlider.style.right = `${right}px`;
  }

  function initializePriceInputs() {
    priceInputs.forEach((input) => {
      const initialValue = input.classList.contains("min-price-input")
        ? currentMinPrice
        : currentMaxPrice;
      input.value = `$ ${Format(initialValue)}`; // Set initial value with currency symbol
    });
  }

  function syncInputSlider(syncInput = true, syncSlider = true) {
    if (syncInput) {
      initializePriceInputs();
    }
    if (syncSlider) {
      initializePriceRange();
    }
  }
}

export default Filter;
