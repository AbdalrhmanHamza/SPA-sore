class Pagination extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    const template = document.getElementById("pagination");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    // start logic
    let Url = new URL(window.location);
    let page = Url.searchParams.get("p") || 1;
    page = +page;
    const limit = this.dataset.limit || 9;
    const numOfProducts = this.dataset.numOfProducts || 0;
    const numOfPages = Math.ceil(numOfProducts / limit);
    const pagList = this.querySelector(".pag-items-list");
    // logic
    if (page < 4 || numOfPages <= 5) {
      for (let i = 0, x = 1; numOfPages <= 5 ? i < numOfPages : i < 6; i++) {
        let pagLi = document.createElement("li");
        if (i == 4 && numOfPages > 5) {
          pagLi.classList.add("pag-item-ellipsis");
          pagLi.textContent = "...";
          pagList.appendChild(pagLi);
          continue;
        }
        pagLi.classList.add("pag-item");
        if (x == page) {
          pagLi.classList.add("active");
        }
        if (i == 5) {
          x = numOfPages;
        }
        let pagLink = document.createElement("a");
        Url.searchParams.set("p", x);
        pagLink.href = `${Url.pathname}${Url.search}`;
        // pagLink.href = `${Url.pathname}?p=${x}`;
        pagLink.classList.add("nav-link");
        pagLink.textContent = x;
        pagLi.appendChild(pagLink);
        pagList.appendChild(pagLi);
        x++;
      }
    } else if (page >= 4 && page < numOfPages - 2) {
      for (let i = 0, x = 1; i < 7; i++) {
        let pagLi = document.createElement("li");
        if (i == 1 || i == 5) {
          pagLi.classList.add("pag-item-ellipsis");
          pagLi.textContent = "...";
          pagList.appendChild(pagLi);
          i == 1 ? (x = page - 1) : (x = numOfPages);
          continue;
        }
        pagLi.classList.add("pag-item");
        if (i == 3) {
          pagLi.classList.add("active");
        }
        let pagLink = document.createElement("a");
        Url.searchParams.set("p", x);
        pagLink.href = `${Url.pathname}${Url.search}`;
        // pagLink.href = `${Url.pathname}?p=${x}`;
        pagLink.classList.add("nav-link");
        pagLink.textContent = x;
        pagLi.appendChild(pagLink);
        pagList.appendChild(pagLi);
        x++;
      }
    } else {
      for (let i = 0, x = 1; i < 6; i++) {
        let pagLi = document.createElement("li");
        if (i == 1) {
          pagLi.classList.add("pag-item-ellipsis");
          pagLi.textContent = "...";
          pagList.appendChild(pagLi);
          x = numOfPages - 3;
          continue;
        }
        pagLi.classList.add("pag-item");
        if (x == page) {
          pagLi.classList.add("active");
        }
        let pagLink = document.createElement("a");
        Url.searchParams.set("p", x);
        pagLink.href = `${Url.pathname}${Url.search}`;
        // pagLink.href = `${Url.pathname}?p=${x}`;
        pagLink.classList.add("nav-link");
        pagLink.textContent = x;
        pagLi.appendChild(pagLink);
        pagList.appendChild(pagLi);
        x++;
      }
    }

    // next-prev
    const prevBtn = this.querySelector(".pag-link-prev");
    const nextBtn = this.querySelector(".pag-link-next");
    if (page <= 1) {
      prevBtn.classList.add("disabled");
      prevBtn.setAttribute("aria-disabled", "true");
      prevBtn.href = "";
    } else {
      Url.searchParams.set("p", page - 1);
      prevBtn.href = `${Url.pathname}${Url.search}`;
      //   prevBtn.href = `${Url.pathname}?p=${page - 1}`;
    }
    if (page >= numOfPages) {
      nextBtn.classList.add("disabled");
      nextBtn.setAttribute("aria-disabled", "true");
      nextBtn.href = "";
    } else {
      Url.searchParams.set("p", page + 1);
      nextBtn.href = `${Url.pathname}${Url.search}`;
      //   nextBtn.href = `${Url.pathname}?p=${page + 1}`;
    }
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("pagination-component", Pagination);

export default Pagination;
