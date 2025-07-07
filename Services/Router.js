import initializeCarousel from "../Components/Carousel.js";

const Router = {
  init: () => {
    function eventHandler(e) {
      const eventTarget = e.target.closest("a.nav-link");
      if (!eventTarget) return;
      e.preventDefault();
      const path = eventTarget.getAttribute("href");
      Router.go(path);
    }

    document.addEventListener("click", eventHandler);
  },
  setMetaData(title, color) {
    document.title = title || "Asteroids Store";
    document.querySelector("meta[name='theme-color']").content =
      color || "#000000";
  },

  go: (path, addToHistory = true) => {
    if (addToHistory) {
      history.pushState(null, "", path);
    }

    let Url = new URL(path, window.location.origin);
    // if (Url.searchParams.has("p")) {
    //   path = Url.pathname;
    // } else if (Url.searchParams.has("id") && Url.pathname === "/product") {
    //   path = Url.pathname;
    // }
    path = Url.pathname;

    const root = document.getElementById("main-section");
    let pageElement = null;
    // const header = document.getElementById("header");
    // const headerTemplate = header.content.cloneNode(true);
    const footer = document.getElementById("footer-sec");
    const footerTemplate = footer.content.cloneNode(true);

    switch (path) {
      case "/":
        Router.setMetaData("Asteroids Store", "green");
        pageElement = document.getElementById("home");
        render(pageElement.content.cloneNode(true), initializeCarousel);
        break;
      case "/shop":
        Router.setMetaData("Shop - Asteroids Store", "green");
        pageElement = document.createElement("shop-component");
        render(pageElement);
        break;
      case "/about":
        Router.setMetaData("About - Asteroids Store", "green");
        pageElement = document.getElementById("about");
        render(pageElement.content.cloneNode(true));
        break;
      case "/product":
        pageElement = document.createElement("product-component");
        render(pageElement);
        break;
      case "/cart":
        Router.setMetaData("Cart - Asteroids Store", "green");
        pageElement = document.createElement("cart-container");
        render(pageElement);
        break;
      default:
        render();
    }

    function render(element, call = null) {
      root.innerHTML = "";
      // root.appendChild(headerTemplate);
      if (element) {
        root.appendChild(element);
      } else {
        const error = document.createElement("h2");
        error.textContent = "404! Not Found ";
        error.style.marginBlock = "4rem";
        error.style.textAlign = "center";
        const link = document.createElement("a");
        link.classList.add("nav-link");
        link.href = "/";
        link.textContent = "Go to Home Page";
        link.style = `
        color: var(--explore-btn-bg-color);
        font-size: 1.5rem;
        font-weight: 600;
        border-bottom: 2px solid var(--explore-btn-bg-color);
        `;
        error.appendChild(link);
        root.appendChild(error);
      }
      root.appendChild(footerTemplate);

      if (call) call();

      window.scrollTo(0, 0);
    }
  },
};

export default Router;
