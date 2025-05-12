<template>
  <div>
    <h2>Listening Section</h2>
    <div v-if="currentQuestion">
      <p><strong>Q{{ currentIndex + 1 }}:</strong> {{ currentQuestion.text }}</p>
    </div>

    <div>
      <ul>
        <li v-for="(choice, i) in currentQuestion?.choices" :key="i">
          <label>
            <input
              type="radio"
              :value="choice"
              :name="'q' + currentIndex"
              v-model="userAnswer"
              :disabled="finished || timeout"
            />
            {{ choice }}
          </label>
        </li>
      </ul>
    </div>

    <button @click="next" :disabled="!userAnswer && !timeout || finished">Next</button>
    <div v-if="finished">
      <p>You scored {{ score }}/{{ questions.length }}</p>
      <p>Average Time: {{ averageTime.toFixed(2) }}s/question</p>
      <p>Estimated Level: <strong>{{ estimatedLevel }}</strong></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import type { Question } from '@/types/quiz'

interface ListeningQuestion extends Question {
  audioText: string
}

const questions = ref<ListeningQuestion[]>([])
const currentIndex = ref(0)
const userAnswer = ref('')
const score = ref(0)
const finished = ref(false)
const timer = ref(0)
const timerInterval = ref<number | null>(null)
const timePerQuestion: number[] = []
const timeout = ref(false)
const TIME_LIMIT = 25

const currentQuestion = computed(() => questions.value[currentIndex.value])

const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  speechSynthesis.speak(utterance)
  utterance.onend = () => {
    startTimer()
  }
}

const startTimer = () => {
  timer.value = 0
  timeout.value = false
  timerInterval.value = setInterval(() => {
    timer.value++
    if (timer.value >= TIME_LIMIT) {
      timeout.value = true
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value !== null) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
    timePerQuestion.push(Math.min(timer.value, TIME_LIMIT))
  }
}

const next = () => {
  stopTimer()
  const timeTaken = Math.min(timer.value, TIME_LIMIT)
  const speedWeight = (TIME_LIMIT - timeTaken) / TIME_LIMIT
  if (userAnswer.value === currentQuestion.value.answer) {
    score.value++
  }

  if (currentIndex.value + 1 < questions.value.length) {
    currentIndex.value++
    userAnswer.value = ''
    setTimeout(() => {
      speak(currentQuestion.value.audioText)
    }, 2000)
  } else {
    finished.value = true
  }
}

const averageTime = computed(() => {
  if (timePerQuestion.length === 0) return 0
  return timePerQuestion.reduce((a, b) => a + b, 0) / timePerQuestion.length
})

const estimatedLevel = computed(() => {
  const ratio = score.value / questions.value.length
  const avgTime = averageTime.value
  if (ratio === 1 && avgTime < 9) return 'C2'
  if (ratio >= 0.9) return 'C1'
  if (ratio >= 0.75) return 'B2'
  if (ratio >= 0.6) return 'B1'
  if (ratio >= 0.4) return 'A2'
  return 'A1'
})

onMounted(async () => {
  const res = await fetch('/questions/listening.json')
  questions.value = await res.json()
  setTimeout(() => {
    speak(currentQuestion.value.audioText)
  }, 2000)
})
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0;
}
li {
  margin: 0.5em 0;
}
button {
  margin-top: 1em;
}
</style>
