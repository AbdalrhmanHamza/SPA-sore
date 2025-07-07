import StoreProxy, { Store } from "../Services/Store.js";

let cart;
function updateStore(
  product,
  updateProduct = false,
  updateCart = false,
  updatedAttributes = {}
) {
  cart = Store.cart;
  // update cart product
  if (updateProduct) {
    if (updateCart) {
      let ProductIndex = cart.findIndex(
        (item) =>
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color &&
          item.idx === product.idx
      );
      if (ProductIndex !== -1) {
        cart[ProductIndex] = {
          ...cart[ProductIndex],
          ...updatedAttributes,
        };
        StoreProxy.cart = cart;
      }
    }
  } else {
    cart.push({
      ...product,
      idx: cart.length,
    });
    StoreProxy.cart = cart;
  }
}

function removeFromStore(productId, quantity, size, color) {
  cart = Store.cart;
  cart = cart.filter(
    (item) =>
      !(
        item.productId === productId &&
        item.size === size &&
        item.color === color &&
        item.quantity === quantity
      )
  );
  StoreProxy.cart = cart;
}

function clearStore() {
  cart = Store.cart;
  StoreProxy.cart = [];
}

export { updateStore, removeFromStore, clearStore };
