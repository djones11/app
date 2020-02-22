// Make a string plural

const pluralise = function(input) {
  let lastLetter = input[input.length - 1];

  if (lastLetter != "s") {
    switch (lastLetter) {
      case "y":
        input = input.substring(0, input.length - 1) + "ies";
        break;
      default:
        input += "s";
        break;
    }
  }

  return input;
};

export default {
  methods: {
    pluralise(input) {
      return pluralise(input);
    }
  }
};
