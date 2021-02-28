<template>
  <v-container class="app-container">
    <v-row>
      <v-img class="mx-auto" max-width="200" src="../assets/bunny.png" />
    </v-row>
    <v-row v-if="sampleSrc.length > 0"
      ><span class="src-text"
        ><a :href="sampleSrc">{{ sampleSrc }}</a></span
      ></v-row
    >
    <v-row>
      <v-textarea
        ref="textArea"
        class="text-area"
        auto-grow
        outlined
        label="Enter text here"
        :value="value"
        @input="checkDisabledInput"
      >
        <template #append>
          <v-btn fab small color="primary" @click="addRandomText">
            <v-icon>mdi-lightbulb</v-icon>
          </v-btn>
        </template>
      </v-textarea>
      <v-btn
        depressed
        block
        color="primary"
        :disabled="disabledInput"
        @click="getAnalysis"
      >
        Summarize
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { sampleTexts } from '../utils/samples'

export default Vue.extend({
  name: 'WriteText',

  data() {
    const value = ''
    const sampleSrc = ''
    const disabledInput = true
    return {
      value,
      sampleSrc,
      disabledInput
    }
  },

  methods: {
    checkDisabledInput() {
      const textArea = this.$refs.textArea as any
      this.disabledInput =
        !textArea ||
        !textArea.internalValue ||
        textArea.internalValue?.trim().length === 0
    },
    addRandomText() {
      const sampleText =
        sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
      ;(this.$refs.textArea as any).internalValue = sampleText.text
      this.sampleSrc = sampleText.src
    },
    getAnalysis() {
      if (this.$router.currentRoute.name === 'Analyse') {
        return
      }
      this.$router.push({
        name: 'Analyse',
        params: {
          textToAnalyse: (this.$refs.textArea as any).internalValue
        }
      })
    }
  }
})
</script>

<style scoped>
.app-container {
  padding-top: 48px;
}
.src-text {
  padding-top: 16px;
}
.text-area {
  padding-top: 16px;
}
</style>
