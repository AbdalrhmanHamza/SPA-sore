import ExportProduct from "../utils/exportProduct.js";
import { updateStore, removeFromStore } from "../utils/updateStore.js";

class CartItem extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    this.info = JSON.parse(this.dataset.productData);
    const STATE = {
      size: this.info.size,
      color: this.info.color,
      quantity: this.info.quantity,
      color: this.info.color,
    };
    // item data
    const title = this.info.title;
    const link = `/product?id=${this.info.productId}`;
    const category = this.info.category || "N/A";
    const price = this.info.price;
    const quantity = this.info.quantity || 1;
    const color = this.info.color || "N/A";
    const size = this.info.size || "N/A";
    const colors = this.info.availableColors || "N/A";
    const sizes = this.info.availableSizes || "N/A";
    const image = this.info.image || "default-image.jpg";
    const productId = this.info.productId || "N/A";
    // dom elements
    const itemImage = this.querySelector(".cart-product-image");
    const itemTitle = this.querySelector(".cart-p-title");
    const itemCategory = this.querySelector(".p-category-anchor");
    const itemLink = this.querySelector(".cart-item-anchor");
    const itemPrice = this.querySelector(".cart-item-price");
    const removeButton = this.querySelector(".remove-cart-item-btn");

    itemImage.src = image;
    itemImage.alt = title;
    itemLink.href = link;
    itemTitle.textContent = title;
    itemCategory.textContent = category;
    itemCategory.href = `/shop?category=${category.toLowerCase()}&style=all&min=0&max=1599`;

    // remove logic
    removeButton.addEventListener("click", () => {
      removeFromStore(productId, quantity, size, color);
    });

    // quantity logic
    const changeQuantity = this.querySelectorAll(".change-q");

    const quantityInput = this.querySelector(".quantity-value");
    quantityInput.textContent = quantity;

    // quantity input
    changeQuantity.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.closest(".increment")) {
          STATE.quantity++;
          quantityInput.textContent = STATE.quantity;
        } else if (e.target.closest(".decrement")) {
          if (STATE.quantity > 1) {
            STATE.quantity--;
            quantityInput.textContent = STATE.quantity;
          } else {
            return;
          }
        }
        // update store
        updateStore(this.info, true, true, STATE);
        console.log("app Cart", app.Store.cart);
      });
    });

    // colors logic
    let activeColor = null;
    const colorSelect = this.querySelector(".color-options");

    this.info.availableColors.forEach((color) => {
      const colorOption = document.createElement("li");
      colorOption.classList.add("size-option");
      const colorBtn = document.createElement("button");
      colorBtn.classList.add(
        "unit-button",
        "select-color-btn",
        "color-cart-btn"
      );
      colorBtn.style.backgroundColor = color.hex;
      colorBtn.dataset.unitcolor = color.hex;

      if (
        activeColor === null &&
        color.available &&
        color.hex === STATE.color
      ) {
        activeColor = colorBtn;
        colorBtn.classList.add("active");
      }
      colorOption.appendChild(colorBtn);
      colorSelect.appendChild(colorOption);
    });

    const colorButtons = this.querySelectorAll(".select-color-btn");
    colorButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeColor?.classList.remove("active");
        STATE.color = button.dataset.unitcolor;
        button.classList.add("active");
        activeColor = button;
        // update store
        updateStore(this.info, true, true, STATE);
        console.log(activeColor, "active color");
      });
    });
  }

  connectedCallback() {
    const template = document.querySelector(".cart-item-template");
    this.content = template.content.cloneNode(true);
    this.appendChild(this.content);
    this.render();
  }
}

customElements.define("cart-item", CartItem);

export default CartItem;
