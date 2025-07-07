import Router from "./Services/Router.js";
import "https://unpkg.com/embla-carousel/embla-carousel.umd.js";
import "https://unpkg.com/embla-carousel-autoplay/embla-carousel-autoplay.umd.js";
import { Store } from "./Services/Store.js";
import API from "./Services/API.js";
import Shop from "./Components/Shop.js";
import Product from "./Components/Product-Components/Product.js";
import Cart from "./Components/Cart.js";

window.app = {};
app.router = Router;
app.info = {};
app.Store = Store;

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
  // update cart badge
  const badgefn = () => {
    const cartBadge = document.querySelector(".cart-badge");
    if (cartBadge) {
      const cartCount = app.Store.cart.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      cartBadge.textContent = cartCount > 9 ? "9+" : cartCount;
      cartBadge.style.hidden = cartCount == 0;
    }
  };
  window.addEventListener("cartUpdated", badgefn);
  badgefn();
});
