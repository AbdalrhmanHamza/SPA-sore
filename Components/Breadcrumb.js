export default class Breadcrumb extends HTMLElement {
  constructor() {
    super();
  }
  render() {
    const template = document.getElementById("breadcrumb");
    let content = template.content.cloneNode(true);
    this.appendChild(content);
    const title = this.dataset.title;
    const breadHead = this.querySelector(".breadcrumb-head");
    breadHead.textContent = title[0].toUpperCase() + title.slice(1);
    const breadRoute = this.querySelector(".bread-crumb-item");
    breadRoute.textContent = title;
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("breadcrumb-component", Breadcrumb);
