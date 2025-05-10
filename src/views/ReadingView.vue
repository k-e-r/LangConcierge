<template>
  <div>
    <h2>Reading Section</h2>
    <p><em>Time left: {{ TIME_LIMIT - timer }}s</em></p>
    <div v-if="currentQuestion">
      <p><strong>Q{{ currentIndex + 1 }}:</strong> {{ currentQuestion.text }}</p>
      <ul>
        <li v-for="(choice, i) in currentQuestion.choices" :key="i">
          <label>
            <input type="radio" :name="'q' + currentIndex" :value="choice" v-model="userAnswer" :disabled="finished || timeout" />
            {{ choice }}
          </label>
        </li>
      </ul>
    </div>

    <button @click="next" :disabled="!userAnswer && !timeout || finished">Next</button>
    <div v-if="finished">
      <p>You scored {{ score }}/{{ questions.length }}</p>
      <p>Average Time: {{ averageTime.toFixed(2) }}s/question</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { Question } from '../types/quiz';

export default defineComponent({
  name: 'ReadingQuiz',
  setup() {
    const questions: Ref<Question[]> = ref([]);
    const currentIndex = ref(0);
    const userAnswer = ref('');
    const score = ref(0);
    const finished = ref(false);
    const timer = ref(0);
    const timerInterval = ref<number | null>(null);
    const timePerQuestion: number[] = [];
    const timeout = ref(false);
    const TIME_LIMIT = 25;

    const currentQuestion = computed(() => questions.value[currentIndex.value]);

    const startTimer = () => {
      timer.value = 0;
      timerInterval.value = setInterval(() => {
        timer.value++;
        if (timer.value >= TIME_LIMIT) {
          timeout.value = true;
          stopTimer();
        }
      }, 1000);
    }

    const stopTimer = () => {
      if (timerInterval.value !== null) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
        timePerQuestion.push(Math.min(timer.value, TIME_LIMIT));
      }
    }

    const next = () => {
      stopTimer();
      if (userAnswer.value === currentQuestion.value.answer) {
        score.value++;
      }

      if (currentIndex.value + 1 < questions.value.length) {
        currentIndex.value++;
        userAnswer.value = '';
        timeout.value = false;
        startTimer();
      } else {
        finished.value = true;
      }
    }

    const averageTime = computed(() => {
      if (timePerQuestion.length === 0) return 0;
      return timePerQuestion.reduce((a, b) => a + b, 0) / timePerQuestion.length;
    })

    onMounted(async () => {
      const res = await fetch('/questions/reading.json');
      const data = await res.json();
      questions.value = data;
      startTimer();
    })

    return {
      questions,
      currentQuestion,
      currentIndex,
      userAnswer,
      score,
      finished,
      timer,
      averageTime,
      timeout,
      TIME_LIMIT,
      next
    }
  }
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