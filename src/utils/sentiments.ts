import sentiment from 'wink-sentiment'

export const analyseSentiment = (text: string): number => {
  return sentiment(text).normalizedScore // -5 to 5
}
