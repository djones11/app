<template>
  <div class="upload_container">
    <label :for="_uid">
      <div
        class="file_upload"
        :class="{
          active: fileOver
        }"
        @dragover.prevent="fileOver = true"
        @dragleave="fileOver = false"
        @drop.prevent="handleFileUpload($event.dataTransfer.files)"
      >
        <img v-if="files.length > 0" :src="files[0]['src']" />
        <h2 v-else>Drop your photo here to upload</h2>
      </div>
    </label>
    <input
      @click="$event.stopPropagation()"
      @change="handleFileUpload($event.target.files)"
      type="file"
      :id="_uid"
      multiple
    />
    <div class="upload_photo_button_container">
      <h4 class="success_message" v-if="showSuccess && files.length == 0">
        Your image has been successfully uploaded and will soon appear in "My
        photos"
      </h4>
      <SynButton
        v-if="files.length > 0"
        buttonText="Upload photo"
        @click="uploadPhoto"
      />
      <Loader :loading="loading" class="loading_container" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import handleUpload from "@/mixins/handleUpload.js";

import SynButton from "@/components/input/SynButton";
import Loader from "@/components/Loader";

export default {
  name: "UploadPhoto",
  data: function() {
    return {
      files: [],
      fileOver: false,
      showSuccess: false,
      loading: false,
      successTimeout: null
    };
  },
  mixins: [handleUpload],
  components: { SynButton, Loader },
  methods: {
    ...mapActions(["submitAjax"]),
    uploadPhoto() {
      clearTimeout(this.successTimeout);
      this.showSuccess = false;

      let payload = {
        body: {},
        url: "photo",
        method: "PUT"
      };

      for (let file in this.files) {
        let pendingFile = this.files[file];
        payload["body"]["filename"] = pendingFile["name"];
      }

      this.loading = true;

      this.submitAjax(payload).then(response => {
        response = response["data"];

        this.loading = false;

        let payload = {
          body: {},
          url: response["url"],
          method: "POST",
          headers: {
            Authorization: null
          }
        };

        const formData = new FormData();

        Object.keys(response.fields).forEach(key => {
          formData.append(key, response.fields[key]);
        });

        // Actual file has to be appended last.
        formData.append("file", this.files[0]);

        payload["body"] = formData;

        this.submitAjax(payload).then(() => {
          this.showSuccess = true;
          this.files = [];

          this.successTimeout = setTimeout(() => {
            this.showSuccess = false;
          }, 8000);
        });
      });
    },
    handleFileUpload(source) {
      let files = [];

      for (let file of source) {
        file["src"] = URL.createObjectURL(file);

        this.$set(file, "selected", false);
        this.$set(file, "_size", this.formatBytes(file["size"]));

        files.push(file);
      }

      if (files.length > 0) {
        this.files = files;
      }

      this.fileOver = false;
    }
  }
};
</script>

<style scoped lang="scss">
.upload_container {
  background-color: inherit;
}
.file_upload {
  position: relative;
  display: flex;
  width: 100%;
  height: 300px;
  padding: 24px 0;
  justify-content: center;
  align-items: center;
  border: 6px dashed $light_grey;
  opacity: 0.8;

  &.active {
    opacity: 1;
  }
}
.upload_photo_button_container {
  position: relative;
  padding-top: 24px;
  font-size: 1.2em;
  text-align: center;
  background-color: inherit;
}
.success_message {
  color: $green;
}
</style>
