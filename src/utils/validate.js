const multiLineStringLimit = n => (text) => {
  return n >= text.match(/^(.+)?$/mg).reduce((ac, el) => ac + el.length, 0);
};

export default {
  multiLineStringLimit,
};
