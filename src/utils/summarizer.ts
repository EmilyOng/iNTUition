import { string, tokens } from 'wink-nlp-utils'

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
  const splitSentence = new RegExp(/([^?.]+[?.])(?:\s|$)/gm)
  const sentenceTokens = text
    .split(splitSentence)
    .filter(word => word.length > 0)
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
      return summary.concat(' ' + sentenceToken)
    }
    return summary
  }, '')
  return summary.trim()
}

export const makeSummary = (text: string): string => {
  const freqTable = createFreqTable(text)
  return scoreSentences(text, freqTable)
}
