import Breadcrumb from "./Breadcrumb.js";
import Products from "./Products.js";
import ProductItem from "./ProductItem.js";
import Pagination from "./Pagination.js";

import Filter from "./filter.js";
import { fetchProducts } from "../Services/FetchProducts.js";

class Shop extends HTMLElement {
  constructor() {
    super();
  }

  state(Limit = 9, filters = {}, Url = new URL(window.location)) {
    this.Limit = Limit;
    this.Url = Url;
    this.filters = this.filter();
  }

  filter() {
    const filters = {};
    filters.category = this.Url.searchParams.get("category") || "all";
    filters.style = this.Url.searchParams.get("style") || "all";
    filters.min = this.Url.searchParams.get("min") || 0;
    filters.max = this.Url.searchParams.get("max") || 1599;
    return filters;
  }

  reRenderProducts() {
    this.state(9);
    this.container.querySelector("products-component").remove();
    this.container.querySelector("pagination-component").remove();
    let products = fetchProducts(this.filters);
    const numOfProducts = products.length;
    console.log(numOfProducts, "numOfProducts");

    const startIndex = ((this.Url.searchParams.get("p") || 1) - 1) * this.Limit;
    const endIndex = startIndex + this.Limit;
    let jsonData = JSON.stringify(products.slice(startIndex, endIndex));
    // products sec
    const productsComponent = document.createElement("products-component");
    productsComponent.dataset.products = jsonData;
    // append before features container
    this.container.insertBefore(
      productsComponent,
      this.container.querySelector(".features-container")
    );

    // pagination
    const pagination = document.createElement("pagination-component");
    pagination.dataset.limit = this.Limit;
    pagination.dataset.numOfProducts = numOfProducts;
    this.container.insertBefore(
      pagination,
      this.container.querySelector(".features-container")
    );
  }

  render() {
    // Clear previous content
    this.container.innerHTML = "";
    // filter Query
    const filter = this.Url.searchParams.get("filter") || "all";
    const page = this.Url.searchParams.get("p") || 1;

    // breadcrumb section
    const breadcrumb = document.createElement("breadcrumb-component");
    breadcrumb.dataset.title = "shop";
    this.container.appendChild(breadcrumb);

    // filter component
    const filterComponent = document.getElementById("filter");
    const filterContent = filterComponent.content.cloneNode(true);
    this.container.appendChild(filterContent);
    Filter();

    // products Data
    let products = fetchProducts(this.filters);
    const numOfProducts = products.length;
    const startIndex = (page - 1) * this.Limit;
    const endIndex = startIndex + this.Limit;
    let jsonData = JSON.stringify(products.slice(startIndex, endIndex));

    // products sec
    const productsComponent = document.createElement("products-component");
    productsComponent.dataset.products = jsonData;
    this.container.appendChild(productsComponent);

    // pagination
    const pagination = document.createElement("pagination-component");
    pagination.dataset.limit = this.Limit;
    pagination.dataset.numOfProducts = numOfProducts;
    this.container.appendChild(pagination);

    // Features
    const features = document.getElementById("features");
    const featuresContent = features.content.cloneNode(true);
    this.container.appendChild(featuresContent);
  }

  connectedCallback() {
    const template = document.getElementById("shop");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    this.container = this.querySelector(".shop-container");
    // Set default values
    this.state(9);
    // Initial render
    this.render();
    // Add event listener for filter updates
    window.addEventListener("filterUpdated", (e) => {
      e.stopPropagation();
      this.reRenderProducts();
    });
  }
}

customElements.define("shop-component", Shop);

export default Shop;

// import lazyLoad from "../utils/lazyLoad.js";
// lazyLoad(
//   "../Components/ProductItem.js",
//   "../Components/Products.js",
//   "../Components/Pagination.js",
//   "../Components/Breadcrumb.js"
// );
