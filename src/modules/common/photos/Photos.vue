<template>
  <div class="photos_container">
    <div class="photo_item" v-for="(photo, index) in photos" :key="photo['id'] + index">
      <a target="_blank" :href="photo['location']">
        <img :src="photo['location']" />
      </a>
    </div>
    <div v-if="photos.length == 0" class="no_items_container">
      <h3>Sorry we can't find any photos</h3>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
  name: "Photos",
  data: function() {
    return {
      photos: []
    };
  },
  activated() {
    this.ADD_GLOBAL_INTERVAL({
      id: "photoCheck",
      duration: 10000,
      immediate: true,
      body: () =>
        new Promise((resolve, reject) => {
          let payload = {
            body: {},
            method: "GET",
            url: "photo"
          };

          this.submitAjax(payload)
            .then(response => {
              response = response["data"];

              for (
                let i = this.photos.length, len = response.length;
                i < len;
                i++
              ) {
                this.photos.push(response[i]);
              }

              resolve(response);
            })
            .catch(error => {
              this.$router.push({
                name: "Login",
                params: {
                  error: {
                    Error: 101,
                    Description: "Token expired"
                  }
                }
              })
              reject(error);
            });
        })
    });
  },
  deactivated() {
    this.REMOVE_GLOBAL_INTERVAL("photoCheck");
  },
  methods: {
    ...mapActions(["submitAjax"]),
    ...mapMutations(["REMOVE_GLOBAL_INTERVAL", "ADD_GLOBAL_INTERVAL"])
  }
};
</script>

<style scoped lang="scss">
.photos_container {
  display: flex;
  padding-bottom: 24px;
  white-space: nowrap;
  overflow-x: auto;
}
.photo_item {
  display: flex;
  padding: 20px;
  margin: 0 6px;
  justify-content: center;
  align-items: center;
  height: 300px;
  min-width: 200px;
  background-color: $light_grey;

  a {
    display: flex;
    height: 100%;
    align-items: center;
  }

  img {
    border: 1px solid $grey;
  }
}
</style>
