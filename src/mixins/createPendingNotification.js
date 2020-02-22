import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(["pendingNotifications"])
  },
  methods: {
    ...mapMutations([
      "UPDATE_PENDING_NOTIFICATION",
      "REMOVE_PENDING_NOTIFICATION",
      "ADD_NOTIFICATION"
    ]),
    createPendingNotification(
      response,
      callbackName,
      showNotification,
      callback
    ) {
      let clickFunction = (ticket, notification) => {
        notification["functionName"] = callbackName;
        notification["function"] = () => {
          this.REMOVE_PENDING_NOTIFICATION(notification["title"]);
          this.$router.push("/Ticket/" + ticket);
        };
      };

      let pendingNotifications = [];

      for (let type in response) {
        if (typeof response[type] == "object") {
          for (let ticket of response[type]) {
            let notification = {};

            switch (type) {
              case "no_answer_client":
                notification["title"] = "#" + ticket + " requires a response";
                notification["message"] =
                  "The client has responded to this ticket";
                break;

              case "unanswered_tickets":
                notification["title"] = "No response to ticket #" + ticket;
                notification[
                  "message"
                ] = `The client has not responded to your ticket in over 3 days, consider closing this`;
                break;

              case "all_tickets":
                notification["title"] = "No response to ticket #" + ticket;
                notification[
                  "message"
                ] = `The client has not responded to this ticket in over 5 days, consider closing this`;
                break;

              case "messages":
                notification["title"] =
                  "Ticket #" + ticket + " has a new message";
                break;

              case "new_ticket":
              case "tickets":
                notification["title"] = "New ticket #" + ticket;
            }

            if (
              !this.pendingNotifications.find(
                x => x["title"] == notification["title"]
              )
            ) {
              if (callbackName) {
                clickFunction(ticket, notification);
              }

              if (showNotification == true) {
                clickFunction(ticket, notification);
                this.ADD_NOTIFICATION(notification);
              }

              pendingNotifications.push(notification);

              if (callback) {
                callback(ticket, notification);
              }
            }
          }
        }
      }

      if (pendingNotifications.length > 0) {
        this.UPDATE_PENDING_NOTIFICATION(pendingNotifications);
      }
    }
  }
};
