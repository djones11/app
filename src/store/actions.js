import axios from "axios";

export default {
  handleError() {},
  submitAjax(context, payload) {
    let method = payload["method"] ? payload["method"].toUpperCase() : "POST";

    let config = {
      method: method,
      url: payload["url"]
    };

    let defaultHeaders = {};

    if (payload["headers"]) {
      config["headers"] = {};

      for (let property in payload["headers"]) {
        if (payload["headers"][property]) {
          config["headers"][property] = payload["headers"][property];
        } else if (axios.defaults.headers.hasOwnProperty(property)) {
          // Allows default headers to be temporarily removed

          defaultHeaders[property] = axios.defaults.headers[property];
          delete axios.defaults.headers[property];
        }
      }
    }

    if (method == "GET") {
      config["params"] = payload["body"];
    } else {
      if (
        config["headers"] &&
        config["headers"]["Content-Type"] == "multipart/form-data"
      ) {
        config["data"] = payload["body"];
      } else {
        let body = payload["body"];

        if (method == "PUT" && !body) {
          config["data"] = payload["body"];
        } else {
          config["data"] = body;
        }
      }
    }

    return new Promise((resolve, reject) => {
      if (window.navigator["onLine"]) {
        axios(config)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            error = error["response"] ? error["response"] : {};
            error["request"] = payload;
            context.dispatch("handleError", error);
            reject(error);
          });

        for (let property in defaultHeaders) {
          axios.defaults.headers[property] = defaultHeaders[property];
        }
      }
    });
  }
};
