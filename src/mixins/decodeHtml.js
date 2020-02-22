// Removes all html from text

export default {
  methods: {
    decodeHtml(string) {
      var parser = new DOMParser();
      var dom = parser.parseFromString(
        "<!doctype html><body>" + string,
        "text/html"
      );

      var content = dom.body.textContent.replaceAll("<br>", "");

      return content;
    }
  }
};
