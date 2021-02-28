<template>
  <v-container class="app-container">
    <v-row>
      <v-dialog v-model="dialog" max-width="600px">
        <template #activator="{ on, attrs }">
          <v-btn outlined block v-bind="attrs" v-on="on">
            Save
            <v-icon right dark>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span>Save Analysis</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field
                  ref="fileName"
                  label="File Name"
                  required
                ></v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="save">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-expansion-panels class="original-text">
        <v-expansion-panel>
          <v-expansion-panel-header>
            Original Text
          </v-expansion-panel-header>
          <v-expansion-panel-content>{{
            textToAnalyse
          }}</v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
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
        v-model="sentiment"
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
    <v-row v-if="canSummarize">
      <v-timeline>
        <v-timeline-item v-for="(data, i) in timeline" :key="i" small>
          <template #opposite>
            <span class="red--text" v-text="data.displayDate"></span>
          </template>
          <div class="py-4">
            <div>{{ data.event }}</div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  makeSummary,
  analyseSentiment,
  Timeline,
  getTimeline
} from '../utils/analysis'
import { BUNNY_STORAGE } from '../utils/bunny-storage'

export default Vue.extend({
  name: 'Analyse',

  computed: {
    textToAnalyse(): string {
      return this.$route.params.textToAnalyse
    }
  },

  data() {
    const dialog = false
    const summaryInfo = {
      canSummarize: false,
      askForSummary: false,
      summary: ''
    }
    const sentimentInfo = {
      sentiment: 0
    }
    const timelineInfo = {
      timeline: [] as Timeline[]
    }
    return {
      dialog,
      ...summaryInfo,
      ...sentimentInfo,
      ...timelineInfo
    }
  },

  mounted() {
    if (!this.textToAnalyse || this.textToAnalyse.trim().length === 0) {
      if (this.$router.currentRoute.name === 'WriteText') {
        return
      }
      this.$router.push({
        name: 'WriteText'
      })
    } else {
      this.analyse()
    }
  },

  methods: {
    analyse() {
      this.summarize()
      this.analyseSentiment()
      this.makeTimeline()
    },
    makeTimeline() {
      this.timeline = getTimeline(this.textToAnalyse)
    },
    summarize() {
      this.summary = makeSummary(this.textToAnalyse)
      this.canSummarize = this.summary.length > 0
    },
    analyseSentiment() {
      this.sentiment = analyseSentiment(this.textToAnalyse)
    },
    save() {
      this.dialog = false
      const notes = localStorage.getItem(BUNNY_STORAGE)
        ? JSON.parse(localStorage.getItem(BUNNY_STORAGE)!)
        : []
      const newNote = {
        timeline: this.timeline,
        summary: this.summary,
        sentiment: this.sentiment,
        title: (this.$refs.fileName as any).internalValue
      }
      localStorage.setItem(BUNNY_STORAGE, JSON.stringify([...notes, newNote]))
      if (this.$router.currentRoute.name === 'Notes') {
        return
      }
      this.$router.push({
        name: 'Notes'
      })
    }
  }
})
</script>

<style scoped>
.original-text,
.summary-text {
  padding-top: 16px;
}
.app-container {
  padding-top: 48px;
}
</style>
