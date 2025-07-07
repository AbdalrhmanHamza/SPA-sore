export const Store = {
  cart: [],
  comparison: [],
};

const StoreProxy = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    if (property == "cart") {
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } else if (property == "comparison") {
      window.dispatchEvent(new CustomEvent("comparisonUpdated"));
    }
    return true;
  },
});

export default StoreProxy;
