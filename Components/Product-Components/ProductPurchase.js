import ExportProduct from "../../utils/exportProduct.js";
import StoreProxy from "../../Services/Store.js";
import { getProductById } from "../../Services/FetchProducts.js";
import { updateStore } from "../../utils/updateStore.js";

class ProductPurchase extends HTMLElement {
  constructor() {
    super();
  }
  state() {
    this.productInfo = JSON.parse(this.dataset.product);
    this.SelectUnitsState = {
      color:
        this.productInfo.colors.find((color) => color.available)?.hex || null,
      size: this.productInfo.sizes.find((size) => size.available)?.size || null,
      quantity: 1,
    };
  }

  DomManipulation() {
    const productViewContainer = this.querySelector(".product-view-container");
    const selectUnit = productViewContainer.querySelectorAll(".select-unit");

    selectUnit.forEach((unit) => {
      const unitButtons = unit.querySelectorAll(".unit-button");
      let activeUnitButton = this.SelectUnitsState[unit.dataset.unit];

      if (activeUnitButton !== null) {
        unitButtons.forEach((button) => {
          if (button.dataset.unitvalue === activeUnitButton) {
            activeUnitButton = button;
            button.classList.add("active");
          } else {
            button.classList.remove("active");
          }
        });
      }

      unitButtons.forEach((button) => {
        if (button.classList.contains("active")) {
          this.SelectUnitsState[unit.dataset.unit] = button.dataset.unitvalue;
          activeUnitButton = button;
        }
        if (button.classList.contains("select-color-btn")) {
          button.style.backgroundColor = button.dataset.colorvalue;
        }

        button.addEventListener("click", () => {
          if (button.classList.contains("active")) {
            return;
          }
          button.classList.add("active");
          activeUnitButton.classList.remove("active");
          activeUnitButton = button;
          this.SelectUnitsState[unit.dataset.unit] = button.dataset.unitvalue;
        });
      });
    });

    const changeQuantity = productViewContainer.querySelectorAll(".change-q");

    const quantityInput = productViewContainer.querySelector(".quantity-value");

    changeQuantity.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.closest(".increment")) {
          this.SelectUnitsState.quantity++;
          quantityInput.textContent = this.SelectUnitsState.quantity;
        } else if (e.target.closest(".decrement")) {
          if (this.SelectUnitsState.quantity > 1) {
            this.SelectUnitsState.quantity--;
            quantityInput.textContent = this.SelectUnitsState.quantity;
          }
        }
      });
    });

    const addToCartButton = productViewContainer.querySelector(
      ".add-to-cart-component-btn"
    );
    // Add to Cart Logic
    addToCartButton.addEventListener("click", () => {
      const productId = new URLSearchParams(window.location.search).get("id");
      const title = this.productInfo.name || "Unknown Product";
      const price = parseFloat(this.productInfo.price || null).toFixed(2);
      const image = this.productInfo.image || null;
      const color = this.SelectUnitsState.color || null;
      const availableColors = this.productInfo.colors;
      const size = this.SelectUnitsState.size || null;
      const availableSizes = this.productInfo.sizes;
      const quantity = this.SelectUnitsState.quantity;
      const category = getProductById(this.productInfo.id, true);
      const exportProduct = new ExportProduct(
        title,
        price,
        productId,
        image,
        color,
        availableColors,
        size,
        availableSizes,
        quantity,
        category
      );
      const exportedProduct = exportProduct.export();
      // Check if the product already exists in the cart
      const existingProductIndex = StoreProxy.cart.findIndex(
        (item) =>
          item.id === exportedProduct.id &&
          item.color === exportedProduct.color &&
          item.size === exportedProduct.size
      );

      if (existingProductIndex !== -1) {
        updateStore(
          {
            ...exportedProduct,
            idx: StoreProxy.cart[existingProductIndex].idx,
          },
          true,
          true,
          {
            quantity: StoreProxy.cart[existingProductIndex].quantity + quantity,
          }
        );
      } else {
        // If it doesn't exist, add it to the cart
        updateStore(exportedProduct, false, false, exportedProduct);
      }
    });

    const compareButton = productViewContainer.querySelector(
      ".compare-component-btn"
    );
    compareButton.addEventListener("click", () => {
      const productId = new URLSearchParams(window.location.search).get("id");
    });

    // preview product image
    const productImage =
      productViewContainer.querySelectorAll(".product-image");
    const mainImage = productViewContainer.querySelector(
      ".product-current-image"
    );

    let currentImage = null;

    productImage.forEach((image) => {
      if (currentImage === null && image.classList.contains("active")) {
        currentImage = image;
        mainImage.src = image.src;
      }
      if (currentImage === null) {
        currentImage = productImage[0];
        mainImage.src = currentImage.src;
      }
      image.addEventListener("click", () => {
        if (image.classList.contains("active")) {
          return;
        }
        mainImage.src = image.src;
        currentImage.classList.remove("active");
        currentImage
          .closest(".product-image-preview")
          .classList.remove("active");
        image.closest(".product-image-preview").classList.add("active");
        image.classList.add("active");
        currentImage = image;
      });
    });
  }

  render() {
    const productViewContainer = this.querySelector(".product-view-container");

    // Setting the product images
    const ProductImages = productViewContainer.querySelector(
      ".product-images-container"
    );
    const mainImage = ProductImages.querySelectorAll(
      "img.product-current-image"
    );
    mainImage[0].src = this.productInfo.image;

    const ProductImageThumbnails =
      ProductImages.querySelector(".product-images");

    this.productInfo.images.forEach((image) => {
      if (image.color == this.SelectUnitsState.color) {
        image.images.forEach((image) => {
          const imageContainer = document.createElement("div");
          imageContainer.classList.add("product-image-preview");
          const img = document.createElement("img");
          img.classList.add("product-image");
          img.src = image;
          img.alt = this.productInfo.name;
          imageContainer.appendChild(img);
          ProductImageThumbnails.appendChild(imageContainer);
        });
      }
    });

    // Setting the product details
    const productInfoContainer = productViewContainer.querySelector(
      ".product-info-container"
    );
    const productTitle = productInfoContainer.querySelector(".product-title");
    const productPrice = productInfoContainer.querySelector(
      ".product-price-info"
    );
    const productDescription = productInfoContainer.querySelector(
      ".product-description"
    );

    // setting the datails
    productTitle.textContent = this.productInfo.name;
    productPrice.textContent = `$${this.productInfo.price}`;
    productDescription.textContent = this.productInfo.description;

    // setting the size options
    const sizeContainer = productInfoContainer.querySelector(".size-selector");
    this.productInfo.sizes.forEach((size) => {
      const sizeLi = document.createElement("li");
      sizeLi.classList.add("size-option");
      const sizeButton = document.createElement("button");
      sizeButton.classList.add("unit-button", "select-btn");
      sizeButton.dataset.unitvalue = size.size;
      sizeButton.textContent = size.size;
      if (size.available === false) {
        sizeButton.disabled = true;
        sizeButton.classList.add("disabled");
      }
      sizeLi.appendChild(sizeButton);
      sizeContainer.appendChild(sizeLi);
    });

    //  setting the color options
    const colorContainer = productInfoContainer.querySelector(".color-options");

    this.productInfo.colors.forEach((color) => {
      const colorLi = document.createElement("li");
      colorLi.classList.add("size-option");
      const colorButton = document.createElement("button");
      colorButton.classList.add("unit-button", "select-color-btn");
      colorButton.dataset.unitvalue = color.hex;
      colorButton.dataset.colorvalue = color.hex;
      if (color.available === false) {
        colorButton.disabled = true;
        colorButton.classList.add("disabled");
      }
      colorLi.appendChild(colorButton);
      colorContainer.appendChild(colorLi);
    });
  }

  connectedCallback() {
    const template = document.getElementById("product-purchase-component");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    this.container = this.querySelector(".product-view-container");

    this.state();
    this.render();
    this.DomManipulation();
  }
}

customElements.define("product-purchase-component", ProductPurchase);

export default ProductPurchase;
