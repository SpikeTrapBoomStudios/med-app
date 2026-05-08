import { For } from "solid-js"

interface Question {
  question: string
  choices: string[]
  answer: string
}

interface QuizPageProperties {
  questions: Question[]
  currentQuestionIndex: number
  selectedAnswerChoice: string | null
  onSelectChoice: (answerChoice: string) => void
  onNext: () => void
  onPrevious: () => void
}

export default function QuizPage(properties: QuizPageProperties) {
  const currentQuestion = () => properties.questions[properties.currentQuestionIndex]

  return (
    <div class="page">
      <p class="question-counter">
        Question {properties.currentQuestionIndex + 1} of {properties.questions.length}
      </p>
      <h2 class="question-text">{currentQuestion().question}</h2>
      <div class="choices">
        <For each={currentQuestion().choices}>
          {(answerChoice) => (
            <button
              class={`answer-choice-button${properties.selectedAnswerChoice === answerChoice ? " selected" : ""}`}
              onClick={() => properties.onSelectChoice(answerChoice)}
            >
              {answerChoice}
            </button>
          )}
        </For>
      </div>
      <div class="navigation-buttons">
        <button class="previous-button" onClick={properties.onPrevious}>
          Previous
        </button>
        <button
          class="next-button"
          disabled={properties.selectedAnswerChoice === null}
          onClick={properties.onNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}
