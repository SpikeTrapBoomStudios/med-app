interface QuestionAnswerRecord {
  question: string
  answer: string | null
}

interface ResultsPageProperties {
  imageUrl: string
  questionAnswerPairs: QuestionAnswerRecord[]
    onRestart: () => void
}

export default function ResultsPage(properties: ResultsPageProperties) {
  return (
    <div class="page results-page">
      <h2>Congrats, the app works!</h2>
      <img class="preview-image" src={properties.imageUrl} alt="your photo" />
      <pre class="results-json">{JSON.stringify(properties.questionAnswerPairs, null, 2)}</pre>
        <button
            class="next-button"
            onClick={properties.onRestart}
        >
            Restart
        </button>
    </div>
  )
}
