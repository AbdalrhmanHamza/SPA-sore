// create web component with the name product-info-component
class ProductInfo extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    const productInfo = JSON.parse(this.dataset.product);
    const contentContainer = this.querySelector(
      ".product-info-viewer-container-p"
    );
    // const Description = productInfo["info-description"];
    const navigation = this.querySelectorAll(".info-link");
    const container = this.querySelector(".product-info-container-p");
    let currentView = this.querySelector(".info-active");
    contentContainer.innerHTML =
      productInfo["product-info"]["info-description"];

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("desc-images");

    productInfo["product-info"]["info-images"].forEach((img) => {
      const pImage = document.createElement("img");
      pImage.classList.add("desc-image");
      pImage.src = img;
      pImage.alt = "Product Image";
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("desc-image-container");
      imgContainer.appendChild(pImage);
      imageContainer.appendChild(imgContainer);
    });
    container.appendChild(imageContainer);

    navigation.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        if (currentView === event.target) return;
        // clrear the container
        contentContainer.innerHTML = "";
        currentView.classList.remove("info-active");
        event.target.classList.add("info-active");
        currentView = event.target;
        const target = event.target.getAttribute("href").slice(1);

        // managing reviews
        if (target == "info-reviews") {
          const reviewsTemplate = document.getElementById("reviews-template");
          const reviewsContent = reviewsTemplate.content.cloneNode(true);
          contentContainer.appendChild(reviewsContent);

          const reviews = productInfo["product-info"]["info-reviews"];
          const reviewsCount = contentContainer.querySelector(".reviews-count");
          const count = reviews.length;
          reviewsCount.textContent = `${count} Reviews`;
          const ulList = contentContainer.querySelector(".review-list-ul");

          reviews.forEach((review) => {
            const li = document.createElement("li");
            li.classList.add("review-item");

            li.innerHTML = `
            <div class="user-image-container">
              <img src="${review.image}" alt="User Image" class="user-image">
            </div>
            <div class="review-content">
              <div class="review-header">
                <span class="review-author">${review.user}</span>
                <span class="review-rating">${"★".repeat(review.rating)}</span>
              </div>
              <p class="review-comment">${review.comment}</p>
              </div>
            `;
            ulList.appendChild(li);
          });
        }

        // managing the product info
        if (target == "additional-info") {
          const tableTemplate = document.getElementById("table-template");
          const tableContent = tableTemplate.content.cloneNode(true);
          contentContainer.appendChild(tableContent);
          const tableHeader = contentContainer.querySelector(".table-head tr");
          const tableBody = contentContainer.querySelector(".table-body");
          const tableData = Object.keys(productInfo["product-info"][target]);
          tableData.forEach((key) => {
            const headerCell = document.createElement("th");
            // and make the first character uppercase
            headerCell.textContent = key
              .replace(/-/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase());
            tableHeader.appendChild(headerCell);

            const bodyRow = contentContainer.querySelector(".table-row");
            const bodyCell = document.createElement("td");
            bodyCell.textContent = productInfo["product-info"][target][key];
            bodyRow.appendChild(bodyCell);
          });
        }

        // description images
        if (target == "info-description") {
          contentContainer.innerHTML = productInfo["product-info"][target];
          const imageContainer = document.createElement("div");
          imageContainer.classList.add("desc-images");

          productInfo["product-info"]["info-images"].forEach((img) => {
            const pImage = document.createElement("img");
            pImage.classList.add("desc-image");
            pImage.src = img;
            pImage.alt = "Product Image";
            const imgContainer = document.createElement("div");
            imgContainer.classList.add("desc-image-container");
            // imgContainer.style.backgroundImage = `url(${img})`;
            imgContainer.appendChild(pImage);
            imageContainer.appendChild(imgContainer);
          });

          container.appendChild(imageContainer);
        } else if (
          target != "info-description" &&
          container.querySelector(".desc-images")
        ) {
          const imageContainer = container.querySelector(".desc-images");
          if (imageContainer) {
            imageContainer.remove();
          }
        }
      });
    });
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
