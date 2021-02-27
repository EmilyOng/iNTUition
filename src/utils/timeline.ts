import nlp from 'wink-nlp'
import its from 'wink-nlp/src/its.js'
import model from 'wink-eng-lite-web-model'
import { format } from 'date-fns'

export interface Timeline {
  date: Date
  event: string
  displayDate: string
}

const winkNLP = nlp(model)

export const getTimeline = (text: string) => {
  const doc = winkNLP.readDoc(text)
  const timelineData: Timeline[] = []
  doc
    .entities()
    .filter((e: any) => {
      if (e.out(its.type) === 'DATE' || e.out(its.type) === 'TIME') {
        timelineData.push({ date: new Date(e.out()), event: e.parentSentence().out(), displayDate: format(new Date(e.out()), 'dd/MM/yyyy')})
      }
    })
  return timelineData.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
}