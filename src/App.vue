<template>
  <v-app>
    <app-bar />
    <v-container>
      <router-view />
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import AppBar from './components/AppBar.vue'

export default Vue.extend({
  name: 'App',

  components: {
    AppBar
  },

  mounted() {
    if (this.$router.currentRoute.name === 'WriteText') {
      return
    }
    this.$router.push({
      name: 'WriteText'
    })
  }
})
</script>
