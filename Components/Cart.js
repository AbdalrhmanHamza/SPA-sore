import CartItem from "./CartItem.js";

class Cart extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    // cart layout placeholders
    const cartItemsContainer = this.querySelector(".cart-items-layout");
    const cartInfoData = this.querySelector(".cart-info-data");
    const cartInfoSubtotal = this.querySelector(".cart-info-value.sub-total");
    const cartInfoTotal = this.querySelector(".cart-info-value.total");
    let total = app.Store.cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    // use intl to format the total
    total = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
    // update total
    cartInfoSubtotal.textContent = total;
    cartInfoTotal.textContent = total;
    // cart items
    app.Store.cart.toReversed().forEach((item) => {
      const cartItem = document.createElement("cart-item");
      cartItem.dataset.productData = JSON.stringify(item);
      cartItemsContainer.appendChild(cartItem);
    });
    // cart info data
    const features = document.getElementById("features");
    const featuresContent = features.content.cloneNode(true);
    this.appendChild(featuresContent);
  }

  updateCartlistener() {
    // clear previous items
    const cartItemsContainer = this.querySelector(".cart-items-layout");
    cartItemsContainer.innerHTML = "";
    this.querySelector(".features-container").remove();
    this.render();
  }

  connectedCallback() {
    const template = document.querySelector(".cart-layout-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    this.render();
    window.addEventListener("cartUpdated", this.updateCartlistener.bind(this));
  }
  disconnectedCallback() {
    window.removeEventListener(
      "cartUpdated",
      this.updateCartlistener.bind(this)
    );
  }
}

customElements.define("cart-container", Cart);

export default Cart;
