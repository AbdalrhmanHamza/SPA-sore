async function lazyLoad(...src) {
  for (const s of src) {
    try {
      const module = await import(s);
      console.log(`Module ${s} loaded successfully.`);
    } catch (error) {
      console.error(`Error loading module ${s}:`, error);
    }
  }
}

export default lazyLoad;
