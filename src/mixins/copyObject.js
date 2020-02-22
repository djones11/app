// Merges all levels of an object

const copyObject = function(o) {
  var output, v, key;

  output = Array.isArray(o) ? [] : {};

  for (key in o) {
    v = o[key];
    output[key] = typeof v === "object" ? copyObject(v) : v;
  }

  return output;
};

export default {
  methods: {
    copyObject(o) {
      return copyObject(o);
    }
  }
};
