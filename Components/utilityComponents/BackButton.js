const template = document.createElement("template");
template.innerHTML = `
   <button aria-label="Go back" class="back-btn">
   <i class="fa-regular fa-arrow-left"></i>
   </button>
`;

class BackButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.appendChild(template.content.cloneNode(true));
    this.button = this.querySelector(".back-btn");
    this.button.addEventListener("click", () => {
      // Navigate back to the previous page
      window.history.back();
    });
  }
}

customElements.define("back-button", BackButton);

export default BackButton;
