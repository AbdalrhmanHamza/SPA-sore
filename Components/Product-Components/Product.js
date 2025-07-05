import { getProductById } from "../../Services/FetchProducts.js";
import ProductPurchase from "./ProductPurchase.js";
import ProductInfo from "./ProductInfo.js";
import BackButton from "../utilityComponents/BackButton.js";

class Product extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    const url = new URL(window.location.href);
    const productId = url.searchParams.get("id");
    const product = getProductById(productId);

    if (!product) {
      this.container.innerHTML = `<h1>No Product with ID: ${productId} was found.</h1>`;
      return;
    }

    // implement backbutton
    const backButton = document.createElement("back-button");
    this.container.appendChild(backButton);

    // render the product details
    const ProductDetailsComponent = document.createElement(
      "product-purchase-component"
    );
    ProductDetailsComponent.dataset.product = JSON.stringify(product);
    this.container.appendChild(ProductDetailsComponent);

    // product Inforamtion
    const InfoComponent = document.createElement("product-info-component");
    InfoComponent.dataset.product = JSON.stringify(product);
    this.container.appendChild(InfoComponent);
  }

  connectedCallback() {
    const template = document.getElementById("product-page");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    this.container = this.querySelector(".product-page-container");
    // render the content of the product
    this.render();
  }
}

customElements.define("product-component", Product);

export default Product;
