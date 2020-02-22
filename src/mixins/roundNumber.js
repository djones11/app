// Rounds a number to a desired number of decimal places

export default {
  methods: {
    roundNumber(n1, n2 = 100, dp = 2) {
      if (n2 > 0) {
        let rounded = "1";

        for (let i = 0, len = dp; i < len; i++) {
          rounded += "0";
        }

        let numberTwo = 1;

        if (n2 != undefined) {
          numberTwo = n2;
        }

        return (
          Math.round((n1 / numberTwo) * 100 * parseInt(rounded)) /
          parseInt(rounded)
        );
      } else {
        return 0;
      }
    }
  }
};
