<template>
  <v-container class="app-container">
    <v-row>
      <v-img class="mx-auto" max-width="200" src="../assets/bunny.png" />
    </v-row>
    <v-expansion-panels class="notes-area">
      <v-expansion-panel v-for="(note, i) in notes" :key="i">
        <v-expansion-panel-header>
          {{ note.title }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-textarea auto-grow outlined disabled :value="note.summary" />
          </v-row>
          <v-row>
            <v-slider
              v-model="note.sentiment"
              label="Sentiment"
              thumb-color="red"
              thumb-label="always"
              readonly
              :min="-10"
              :max="10"
            >
              <template #prepend>
                <v-text-field
                  :value="-10"
                  hide-details
                  single-line
                  disabled
                  type="number"
                ></v-text-field>
              </template>
              <template #append>
                <v-text-field
                  :value="10"
                  hide-details
                  single-line
                  disabled
                  type="number"
                ></v-text-field>
              </template>
            </v-slider>
          </v-row>
          <v-row>
            <v-timeline>
              <v-timeline-item
                v-for="(data, i) in note.timeline"
                :key="i"
                small
              >
                <template #opposite>
                  <span class="red--text" v-text="data.displayDate"></span>
                </template>
                <div class="py-4">
                  <div>{{ data.event }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { BUNNY_STORAGE } from '../utils/bunny-storage'

export default Vue.extend({
  name: 'Notes',

  data() {
    const notes = localStorage.getItem(BUNNY_STORAGE)
      ? JSON.parse(localStorage.getItem(BUNNY_STORAGE)!)
      : []
    return {
      notes
    }
  }
})
</script>

<style scoped>
.app-container {
  padding-top: 48px;
}
.notes-area {
  padding-top: 48px;
}
</style>
