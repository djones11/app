// Make a string prettier

const makePretty = function(input, splitCapitals = true) {
  if (input) {
    input = input.split("_").join(" ");

    if (splitCapitals) {
      input = input.split(/(?=[A-Z])/).join(" ");
    }
  }

  return input == null ? input : input.charAt(0).toUpperCase() + input.slice(1);
};

export default {
  methods: {
    makePretty(input, splitCapitals) {
      return makePretty(input, splitCapitals);
    }
  }
};
