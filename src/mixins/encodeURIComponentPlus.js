// Adds extra replacements to normal encodeURIComponent

export default {
  methods: {
    encodeURIComponentPlus(str) {
      return encodeURIComponent(str)
        .replace(/[!'()]/g, escape)
        .replace(/\*/g, "%2A");
    }
  }
};
