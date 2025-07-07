import { updateStore } from "../utils/updateStore.js";
import ExportProduct from "../utils/exportProduct.js";
import StoreProxy from "../Services/Store.js";
import { getProductById } from "../Services/FetchProducts.js";

export default class ProductItem extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    const template = document.getElementById("product-card");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    const data = this.dataset.productData;
    const productData = JSON.parse(data);
    const productImg = this.querySelector(".product-img");
    const ProductLink = this.querySelector(".product-link");
    const productTitle = this.querySelector(".product-name");
    const productDesc = this.querySelector(".product-desc");
    const productPrice = this.querySelector(".discounted-price");
    const oldPrice = this.querySelector(".old-price");
    // Set the product data to the elements
    productImg.src = productData.image;
    ProductLink.href = `/product?id=${productData.id}`; // Assuming the product ID is used in the URL
    productTitle.textContent = productData.name;
    productTitle.setAttribute("title", productData.name);
    productDesc.textContent = productData.description;
    productDesc.setAttribute("title", productData.description);
    productPrice.textContent = `$${productData.price}`;
    oldPrice.textContent = `$${productData.oldPrice}`;

    // Add event listener for the add to cart button
    const addToCartButton = this.querySelector(".add-to-cart-btn");
    addToCartButton.addEventListener("click", () => {
      console.log("sdadfalsdkj", productData);
      const category = getProductById(productData.id, true);
      const color = productData.colors.some((c) => c.available === true);
      const size = productData.sizes.some((s) => s.available === true);
      const exportProduct = new ExportProduct(
        productData.name,
        productData.price,
        productData.id,
        productData.image,
        color,
        productData.colors,
        size,
        productData.sizes,
        1,
        category
      );
      const exportedProduct = exportProduct.export();
      const existingProductIndex = StoreProxy.cart.findIndex(
        (item) =>
          item.id === exportProduct.id &&
          item.color === exportProduct.color &&
          item.size === exportProduct.size
      );

      if (existingProductIndex !== -1) {
        updateStore(
          {
            ...exportProduct,
            idx: StoreProxy.cart[existingProductIndex].idx,
          },
          true,
          true,
          {
            quantity: StoreProxy.cart[existingProductIndex].quantity + 1,
          }
        );
      } else {
        updateStore(exportedProduct, false, false, {
          idx: StoreProxy.cart.length,
        });
      }
    });
  }
  connectedCallback() {
    this.render();
  }
}

customElements.define("product-item", ProductItem);
