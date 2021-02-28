import { winkNLP } from './winkjs-model'
import its from 'wink-nlp/src/its.js'
import { string, tokens } from 'wink-nlp-utils'
import { format } from 'date-fns'

export interface Timeline {
  date: Date
  event: string
  displayDate: string
}

interface FreqTable {
  [key: string]: number
}

interface TokenizeWord {
  value: string
  tag: string
}

const PUNCTUATION = 'punctuation'

const createFreqTable = (text: string): FreqTable => {
  const tokenize = string
    .tokenize(text, true)
    .filter((word: TokenizeWord) => word.tag !== PUNCTUATION)
    .map((word: TokenizeWord) => word.value)
  const words = tokens.removeWords(tokenize)
  const freqTable: FreqTable = {}
  words.forEach((word: string) => {
    const rootWord = string.stem(word)
    freqTable[rootWord] ? freqTable[rootWord]++ : (freqTable[rootWord] = 1)
  })
  const maxFreq = Math.max(...Object.values(freqTable))
  Object.keys(freqTable).forEach(word => {
    freqTable[word] /= maxFreq
  })
  return freqTable
}

const scoreSentences = (text: string, freqTable: FreqTable): string => {
  const sentenceTokens: string[] = winkNLP
    .readDoc(text)
    .sentences()
    .out()
  const sentenceFreq: FreqTable = {}
  const wordFreqKeys = Object.keys(freqTable)
  sentenceTokens.forEach(sentenceToken => {
    wordFreqKeys.forEach(word => {
      if (sentenceToken.toLowerCase().includes(word.toLowerCase())) {
        sentenceFreq[sentenceToken]
          ? (sentenceFreq[sentenceToken] += freqTable[word])
          : (sentenceFreq[sentenceToken] = freqTable[word])
      }
    })
    sentenceFreq[sentenceToken] /= string.tokenize(sentenceToken, true).length
  })
  const sentenceFreqKeys = Object.keys(sentenceFreq)
  const sentenceSum = sentenceFreqKeys.reduce((acc, word) => {
    return (acc += sentenceFreq[word])
  }, 0)
  const average = sentenceSum / sentenceFreqKeys.length
  const threshold = average
  const summary = sentenceTokens.reduce((summary, sentenceToken) => {
    if (
      sentenceFreqKeys.includes(sentenceToken) &&
      sentenceFreq[sentenceToken] >= threshold
    ) {
      return summary.concat(sentenceToken)
    }
    return summary
  }, '')
  return summary.trim()
}

export const makeSummary = (text: string): string => {
  const freqTable = createFreqTable(text)
  return scoreSentences(text, freqTable)
}

export const analyseSentiment = (text: string): number => {
  return Math.round(winkNLP.readDoc(text).out(its.sentiment) * 10)
}

export const getTimeline = (text: string) => {
  const doc = winkNLP.readDoc(text)
  const timelineData: Timeline[] = []
  doc.entities().filter((e: any) => {
    if (e.out(its.type) === 'DATE' || e.out(its.type) === 'TIME') {
      try {
        timelineData.push({
          date: new Date(e.out()),
          event: e.parentSentence().out(),
          displayDate: format(new Date(e.out()), 'dd/MM/yyyy')
        })
      } catch (e) {
        return
      }
    }
  })
  return timelineData.sort((a, b) =>
    a.date > b.date ? 1 : b.date > a.date ? -1 : 0
  )
}
