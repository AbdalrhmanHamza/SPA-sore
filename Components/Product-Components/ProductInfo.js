// create web component with the name product-info-component
class ProductInfo extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    const productInfo = JSON.parse(this.dataset.product);
    const Description = productInfo.description;
  }

  connectedCallback() {
    const template = document.getElementById("product-info-component");
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    this.render();
  }
}

customElements.define("product-info-component", ProductInfo);

export default ProductInfo;
