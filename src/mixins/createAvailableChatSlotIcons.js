export default {
  methods: {
    createAvailableChatSlotIcons(current, max) {
      let slotHtml = "<div class='chat_capacity_container'>";

      for (let i = 0; i < max; i++) {
        let slotClass = i < current ? "used_slot" : "";

        slotHtml += `
          <span class="icon icon-user3 chat_slot_icon ${slotClass}"></span>
        `;
      }

      slotHtml += "</div>";

      return slotHtml;
    }
  }
};
