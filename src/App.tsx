import './App.scss'
import { createSignal, Match, Switch } from "solid-js"
import PhotoUploadPage from "./pages/PhotoUploadPage"
import QuizPage from "./pages/QuizPage"
import ResultsPage from "./pages/ResultsPage"

type PageName = "upload" | "quiz" | "results"

const QUESTIONS = [
  {
    question: "What color is the sky?",
    choices: ["Red", "Blue", "Green", "Yellow"],
    answer: "Blue",
  },
  {
    question: "How many legs does a dog have?",
    choices: ["2", "4", "6", "8"],
    answer: "4",
  },
  {
    question: "What sound does a cow make?",
    choices: ["Moo", "Bark", "Meow", "Oink"],
    answer: "Moo",
  },
  {
    question: "Which is the biggest?",
    choices: ["An ant", "A cat", "An elephant", "A mouse"],
    answer: "An elephant",
  },
]

function App() {
  const [currentPage, setCurrentPage] = createSignal<PageName>("upload")
  const [imageUrl, setImageUrl] = createSignal<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0)
  const [selectedAnswerChoice, setSelectedChoice] = createSignal<string | null>(null)
  const [userAnswers, setUserAnswers] = createSignal<string[]>([])

  function handlePhotoUpload(event: Event) {
    const fileInput = event.target as HTMLInputElement
    const selectedFile = fileInput.files?.[0]
    if (!selectedFile) return
    const blobUrl = URL.createObjectURL(selectedFile)
    setImageUrl(blobUrl)
  }

  function handleQuizNext() {
    const selectedAnswer = selectedAnswerChoice()
    if (!selectedAnswer) return
    setUserAnswers([...userAnswers(), selectedAnswer])
    setSelectedChoice(null)
    if (currentQuestionIndex() + 1 >= QUESTIONS.length) {
      setCurrentPage("results")
    } else {
      setCurrentQuestionIndex(currentQuestionIndex() + 1)
    }
  }

  function handleQuizPrevious() {
    if (currentQuestionIndex() === 0) {
      setSelectedChoice(null)
      setCurrentPage("upload")
      return
    }
    const previousAnswers = userAnswers().slice(0, -1)
    setSelectedChoice(userAnswers()[userAnswers().length - 1])
    setUserAnswers(previousAnswers)
    setCurrentQuestionIndex(currentQuestionIndex() - 1)
  }

  function handleRestart() {
    setImageUrl("")
    setUserAnswers([])
    setCurrentQuestionIndex(0)
    setSelectedChoice(null)
    setCurrentPage("upload")
  }

  const questionAnswerPairs = () =>
    QUESTIONS.map((question, questionIndex) => ({
      question: question.question,
      answer: userAnswers()[questionIndex] ?? null,
    }))

  return (
    <div class="phone-frame">
      <div class="phone-screen">
        <Switch>
          <Match when={currentPage() === "upload"}>
            <PhotoUploadPage
              imageUrl={imageUrl()}
              onPhotoUpload={handlePhotoUpload}
              onNext={() => setCurrentPage("quiz")}
            />
          </Match>
          <Match when={currentPage() === "quiz"}>
            <QuizPage
              questions={QUESTIONS}
              currentQuestionIndex={currentQuestionIndex()}
              selectedAnswerChoice={selectedAnswerChoice()}
              onSelectChoice={setSelectedChoice}
              onNext={handleQuizNext}
              onPrevious={handleQuizPrevious}
            />
          </Match>
          <Match when={currentPage() === "results"}>
            <ResultsPage
              imageUrl={imageUrl()!}
              questionAnswerPairs={questionAnswerPairs()}
              onRestart={handleRestart}
            />
          </Match>
        </Switch>
      </div>
    </div>
  )
}

export default App
