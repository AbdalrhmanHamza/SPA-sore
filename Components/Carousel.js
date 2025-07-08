export default function initializeCarousel() {
  const emblaNode = document.querySelector(".embla");
  const options = { loop: true };
  const plugins = [EmblaCarouselAutoplay()];
  const emblaApi = EmblaCarousel(emblaNode, options, plugins);
  const prevButtonNode = emblaNode.querySelector(".embla__prev");
  const nextButtonNode = emblaNode.querySelector(".embla__next");
  prevButtonNode.addEventListener("click", emblaApi.scrollPrev, false);
  nextButtonNode.addEventListener("click", emblaApi.scrollNext, false);

  const Slides = emblaNode.querySelector(".embla__container");
  const SlidesLength = Slides.querySelectorAll(".embla__slide").length;
  const carouselIndicator = document.querySelector(".carousel-indicator");

  for (let i = 0; i < SlidesLength; i++) {
    const indicator = document.createElement("span");
    indicator.classList.add("indicator");

    if (i === 0) {
      indicator.classList.add("active");
    }

    carouselIndicator.appendChild(indicator);
  }

  //   let current_snap = 0;
  let last_snap = 0;
  const indicators = emblaNode.querySelectorAll(".indicator");

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      emblaApi.scrollTo(index);
      indicators[last_snap].classList.remove("active");
      indicator.classList.add("active");
      last_snap = index;
    });
    indicator.style.flex = `0 0 ${
      (carouselIndicator.clientWidth - 8 * SlidesLength) / SlidesLength
    }px`;
  });

  emblaApi.on("slidesInView", () => {
    const currentIndex = emblaApi.selectedScrollSnap();
    if (currentIndex < indicators.length) {
      indicators[last_snap].classList.remove("active");
      indicators[currentIndex].classList.add("active");
      last_snap = currentIndex;
    }
  });
  function ComponentResizer() {
    indicators.forEach((indicator) => {
      indicator.style.flex = `0 0 ${
        (carouselIndicator.clientWidth - 8 * SlidesLength) / SlidesLength
      }px`;
    });
  }

  window.addEventListener("resize", () => {
    ComponentResizer(".carousel-layout", ".carousel-card");
  });

  const cards = document.querySelector(".carousel-cards");
  let isDragging = false;

  cards.addEventListener("mousedown", (event) => {
    // Check if the user has already selected text within the carousel-cards
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (selectedText && cards.contains(selection.anchorNode)) {
      // If text is already selected within the carousel-cards, do not disable user-select
      return;
    }

    isDragging = false; // Reset dragging state
    const onMouseMove = () => {
      isDragging = true; // User is dragging
      document.body.style.userSelect = "none"; // Disable text selection
    };
    // Attach mousemove listener to detect dragging
    document.addEventListener("mousemove", onMouseMove);
    // Remove mousemove listener on mouseup
    document.addEventListener(
      "mouseup",
      () => {
        document.body.style.userSelect = ""; // Re-enable text selection
        document.removeEventListener("mousemove", onMouseMove);
      },
      { once: true }
    );
  });
  // Allow text selection if it was a click (not a drag)
  cards.addEventListener("click", (event) => {
    if (!isDragging) {
      document.body.style.userSelect = ""; // Ensure text selection is enabled
    }
  });
}
