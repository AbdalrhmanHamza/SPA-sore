const API = {
  url: "../data/Products/Products.json",

  fetchProducts: async () => {
    try {
      const response = await fetch(API.url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  },
};

export default API;
