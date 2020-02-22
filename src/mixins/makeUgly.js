// Make a string prettier

const makeUgly = function(input, underscoreReplacement = "_") {
  return input == null
    ? input
    : input
        .toLowerCase()
        .replace(" ", underscoreReplacement)
        .replace(/\W/g, "");
};

export default {
  methods: {
    makeUgly(input, underscoreReplacement) {
      return makeUgly(input, underscoreReplacement);
    }
  }
};
