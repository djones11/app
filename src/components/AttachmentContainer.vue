<template functional>
  <div class="attachment_wrapper" v-if="props.attachments.length > 0">
    <div
      class="attachment_container"
      v-for="attachment in props.attachments"
      :key="attachment[props.nameProperty] + attachment[props.urlProperty]"
    >
      <!-- :to="{ name: 'user', params: { userId: 123 }}" -->
      <router-link
        :to="{
          name: 'Preview',
          params: { doc: attachment[props.urlProperty] }
        }"
      >
        <img
          v-if="/\.(jpe?g|png|gif|bmp)$/i.test(attachment[props.urlProperty])"
          class="attachment"
          :src="attachment[props.urlProperty]"
        />

        <p class="fake_link" v-else>
          <span class="icon icon-file-text-o"></span>
          <span>{{ attachment[props.nameProperty] }}</span>
        </p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "AttachmentContainer",
  props: {
    attachments: {
      type: Array,
      default: () => []
    },
    urlProperty: {
      type: String,
      default: "url"
    },
    nameProperty: {
      type: String,
      default: "attachmentName"
    }
  }
};
</script>

<style scoped lang="scss">
.attachment_container {
  display: block;
  padding: 12px 0;
  font-size: 1.1em;

  img {
    max-width: 300px;
    border-radius: 12px;
    cursor: zoom-in;
  }
}
</style>
