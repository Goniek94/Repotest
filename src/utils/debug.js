export const debug = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

if (typeof globalThis !== 'undefined') {
  globalThis.debug = debug;
}
