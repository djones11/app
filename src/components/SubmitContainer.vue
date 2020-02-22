<template>
  <div class="submit_cancel_button_container">
    <SynButton
      buttonText="Cancel"
      class="no_background"
      @click="$emit('cancel')"
    />
    <SynButton
      buttonText="Confirm"
      :disabled="disable"
      class="synthetix"
      @click="$emit('submit')"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import SynButton from "@/components/input/SynButton.vue";

export default {
  name: "SubmitContainer",
  props: {
    disable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SynButton
  }
};
</script>

<style scoped lang="scss">
.submit_cancel_button_container {
  display: flex;
  padding: 10px 0;
  justify-content: flex-end;

  & /deep/ .button_container {
    margin-left: 20px;
  }
}
</style>
