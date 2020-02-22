// Validates string inputs against a config object

export default {
  methods: {
    validator(inputString, options) {
      if (typeof inputString == "string") {
        this.$set(options, "passed", true);

        for (let i in options) {
          if (typeof options[i] == "object") {
            switch (options[i]["type"]) {
              case "required":
                options[i]["result"] = inputString ? true : false;
                break;

              case "regex":
                options[i]["result"] = inputString.match(options[i]["value"])
                  ? true
                  : false;
                break;

              case "minlength":
                options[i]["result"] =
                  inputString.length >= options[i]["value"] ? true : false;
                break;

              case "notEqualTo":
                options[i]["result"] =
                  inputString.toLowerCase() != options[i]["value"].toLowerCase()
                    ? true
                    : false;
                break;
            }

            if (options[i]["result"] == false) {
              options["passed"] = false;
            }
          }
        }
      } else {
        console.warn(
          `Validate string is of type ${typeof inputString}, should be string`
        );
      }
    }
  }
};
