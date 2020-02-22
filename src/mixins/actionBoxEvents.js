// Equivalent of jquery $on and $off

export default {
  methods: {
    toggleActionBox(e, actionBox) {
      e.stopPropagation();

      for (let property in this.showActionBox) {
        if (property == actionBox) {
          this.showActionBox[property] = !this.showActionBox[property];
        } else {
          this.showActionBox[property] = false;
        }
      }
    },
    hideActionBox(name) {
      if (typeof name == "string") {
        this.showActionBox[name] = false;
      } else {
        for (let property in this.showActionBox) {
          this.showActionBox[property] = false;
        }
      }
    }
  }
};
