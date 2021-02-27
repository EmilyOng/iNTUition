<template>
  <v-app>
    <v-container class="app-container">
      <v-row>
        <v-textarea
          ref="textArea"
          auto-grow
          outlined
          label="Enter text here"
          :value="value"
        />
        <v-btn depressed block color="primary" @click="analyse">
          Summarize
        </v-btn>
      </v-row>
      <div v-if="askForSummary">
        <v-row>
          <div class="summary-text">Summary</div>
        </v-row>
        <v-row>
          <v-textarea
            v-if="canSummarize"
            auto-grow
            outlined
            disabled
            :value="summary"
          />
        </v-row>
        <v-row>
          <v-alert v-if="!canSummarize" dense outlined type="error">
            Unable to summarize the above text. Please try again.
          </v-alert>
        </v-row>
        <v-row v-if="canSummarize">
          <v-slider
            v-model="score"
            label="Sentiment"
            thumb-color="red"
            thumb-label="always"
            readonly
            :min="-5"
            :max="5"
          />
        </v-row>
        <v-row v-if="canSummarize">
          <v-timeline>
            <v-timeline-item
              v-for="(data, i) in timeline"
              :key="i"
              small
            >
              <template #opposite>
                <span
                  class="red--text"
                  v-text="data.displayDate"
                ></span>
              </template>
              <div class="py-4">
                <div>{{ data.event }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-row>
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { makeSummary } from './utils/summarizer'
import { analyseSentiment } from './utils/sentiments'
import { Timeline, getTimeline } from './utils/timeline'

export default Vue.extend({
  name: 'App',

  data() {
    const value = ''
    const summaryInfo = {
      canSummarize: false,
      askForSummary: false,
      summary: ''
    }
    const sentimentInfo = {
      score: 0
    }
    const timelineInfo = {
      timeline: [] as Timeline[]
    }
    return {
      value,
      ...summaryInfo,
      ...sentimentInfo,
      ...timelineInfo
    }
  },

  methods: {
    analyse() {
      this.summarize()
      this.analyseSentiment()
      this.makeTimeline()
    },
    makeTimeline() {
      const text = (this.$refs.textArea as any).internalValue
      this.timeline = getTimeline(text)
      console.log(this.timeline)
    },
    summarize() {
      const textToSummarize = (this.$refs.textArea as any).internalValue
      this.askForSummary = true
      this.summary = makeSummary(textToSummarize)
      this.canSummarize = this.summary.length > 0
    },
    analyseSentiment() {
      const text = (this.$refs.textArea as any).internalValue
      this.score = analyseSentiment(text)
    }
  }
})
</script>

<style scoped>
.summary-text {
  padding-top: 16px;
}
.app-container {
  padding-top: 48px;
}
</style>
