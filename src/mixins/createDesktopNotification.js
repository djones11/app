import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("Comms", ["retrieveEntity"]),
    createDesktopNotification(title, body = "", data) {
      if (
        this.userInformation["preferences"]["notification"] &&
        Notification.permission == "granted"
      ) {
        let id = title + body;
        let notificationData = {
          icon: "../assets/images/xan_logo.png",
          tag: id,
          requireInteraction: true,
          body,
          data
        };

        let notification = new Notification(title, notificationData);

        notification.onclick = event => {
          let data = event.target["data"];
          window.focus();
          console.log(this.$router);
          if (data["page"] && data["page"] != this.$route["name"]) {
            this.$router.push({
              name: data["page"]
            });
          }

          // Preset function - can't store function in desktop notifcation

          if (data["useFunction"]) {
            switch (data["useFunction"]) {
              case "retrieveChat":
                if (data["uniQref"]) {
                  this.retrieveEntity(data["uniQref"]);
                }
                break;
            }
          }

          event.target.close();
        };
      }
    }
  }
};
