class ExportProduct {
  constructor(title, price, productId, image, color, size, quantity = 1) {
    this.title = title;
    this.price = price;
    this.quantity = quantity;
    this.color = color || null;
    this.size = size || null;
    this.productId = productId;
    this.image = image;
  }

  export() {
    // Logic to export the product
    return {
      title: this.title,
      price: this.price,
      quantity: this.quantity,
      color: this.color,
      size: this.size,
      productId: this.productId,
      image: this.image,
    };
  }
}

export default ExportProduct;
