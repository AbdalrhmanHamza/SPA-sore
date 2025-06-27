import { fetchProducts } from "../Services/FetchProducts.js";

class Products extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    const template = document.getElementById("products-sec");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    const productContainer = this.querySelector(".products-layout");
    let products;
    try {
      if (this.dataset.products) {
        products = JSON.parse(this.dataset.products);
      } else {
        products = fetchProducts().slice(0, 6);
      }
    } catch (error) {
      console.error("Failed to parse products data:", error, "hello world");
      return; // Exit the function if parsing fails
    }

    if (products.length === 0) {
      const error = document.createElement("h2");
      error.textContent = "This Page Doesn't Exist";
      productContainer.appendChild(error);
    } else {
      for (let product of products) {
        const productItem = document.createElement("product-item");
        productItem.dataset.productData = JSON.stringify(product);
        productContainer.appendChild(productItem);
      }
    }
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("products-component", Products);

export default Products;

// --------
// let numOfItems = +this.dataset.num;
// let productsInfo = app.products[0].products;
// for (let c = 0, i = 0; i < numOfItems; i++) {
//   if (i >= productsInfo.length) {
//     numOfItems = numOfItems - i;
//     i = -1;
//     c++;
//     if (c >= app.products.length) {
//       break;
//     }
//     productsInfo = app.products[c].products;
//     continue;
//   }
//   const productItem = document.createElement("product-item");
//   productItem.dataset.productData = JSON.stringify(productsInfo[i]);
//   productContainer.appendChild(productItem);
// }
// ------------------
// let products = JSON.parse(this.dataset.products);
