<template>
  <div>
    <v-app-bar color="deep-purple accent-4" dense dark>
      <v-toolbar-title>BunnyNotes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="viewNotes">
        <v-icon>mdi-book</v-icon>
      </v-btn>
      <v-btn icon @click="writeText">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppBar',

  methods: {
    viewNotes() {
      if (this.$router.currentRoute.name === 'Notes') {
        return
      }
      this.$router.push({
        name: 'Notes'
      })
    },
    writeText() {
      if (this.$router.currentRoute.name === 'WriteText') {
        return
      }
      this.$router.push({
        name: 'WriteText'
      })
    }
  }
})
</script>
