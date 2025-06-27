function Products(filter = {}) {
  let products = [];
  let appProducts = app.products || [];

  for (let category of appProducts) {
    if (Object.keys(filter).length === 0) {
      products = products.concat(category.products);
      continue;
    }
    if (
      filter.category !== "all" &&
      category.category.toLowerCase() !== filter.category
    ) {
      continue;
    } else {
      for (let product of category.products) {
        if (filter.style !== "all" && product.style !== filter.style) {
          continue;
        }
        if (product.price < filter.min || product.price > filter.max) {
          continue;
        }
        products.push(product);
      }
    }
  }

  return products;
}

function fetchProducts(filters = {}) {
  let products = Products(filters);
  return products;
}

function getProductById(id) {
  console.log("product ID:", id);
  console.log(app.products);
  let c = 1;
  for (let i = 0; i < app.products.length; i++) {
    let product = app.products[i].products.find((item) => item.id == id);
    console.log(product);
    console.log("Searching in category:", app.products[i].category);
    if (product != undefined) {
      return product;
    } else {
      continue;
    }
  }
}

export { fetchProducts, getProductById };
