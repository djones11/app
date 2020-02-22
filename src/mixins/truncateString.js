export default {
  methods: {
    truncateString(string, len) {
      return string.length > len ? `${string.substr(0, len)} ...` : string;
    }
  }
};
