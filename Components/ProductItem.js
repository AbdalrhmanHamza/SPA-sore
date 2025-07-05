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
  }
  connectedCallback() {
    this.render();
  }
}

customElements.define("product-item", ProductItem);
