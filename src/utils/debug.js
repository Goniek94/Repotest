export const debug = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

// Attach to global scope for convenient access
if (typeof globalThis !== 'undefined') {
  globalThis.debug = debug; // eslint-disable-line no-undef
}
