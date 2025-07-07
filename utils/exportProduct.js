class ExportProduct {
  constructor(
    title,
    price,
    productId,
    image,
    color,
    availableColors,
    size,
    availableSizes,
    quantity = 1,
    category = null
  ) {
    this.title = title;
    this.price = price;
    this.quantity = quantity;
    this.color = color || null;
    this.availableColors = availableColors || null;
    this.size = size || null;
    this.availableSizes = availableSizes || null;
    this.productId = productId;
    this.image = image;
    this.category = category || null;
  }

  export() {
    // Logic to export the product
    return {
      title: this.title,
      price: this.price,
      quantity: this.quantity,
      color: this.color,
      availableColors: this.availableColors,
      size: this.size,
      availableSizes: this.availableSizes,
      productId: this.productId,
      image: this.image,
      category: this.category,
    };
  }
}

export default ExportProduct;
