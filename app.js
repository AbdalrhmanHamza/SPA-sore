import Router from "./Services/Router.js";
// import "https://unpkg.com/embla-carousel/embla-carousel.umd.js";
// import "https://unpkg.com/embla-carousel-autoplay/embla-carousel-autoplay.umd.js";
import API from "./Services/API.js";
import Shop from "./Components/Shop.js";
import Product from "./Components/Product-Components/Product.js";

window.app = {};
app.router = Router;
app.info = {};

window.addEventListener("DOMContentLoaded", async () => {
  app.products = await API.fetchProducts();
  app.info.numOfProducts = app.products.reduce((acc, category) => {
    return acc + category.products.length;
  }, 0);
  Router.go(window.location.pathname, false);
  Router.init();
  // number of products

  // Listen for popstate events to handle browser navigation
  window.addEventListener("popstate", () => {
    Router.go(window.location.pathname, false);
  });
});

// async function lazyLoad(src) {
//   await import(src);
// }
