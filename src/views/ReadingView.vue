<template>
  <div>
    <h2>Reading Section</h2>
    <p><em>Time left: {{ TIME_LIMIT - timer }}s</em></p>

    <!-- Passage Display -->
    <div v-if="currentPassage" class="mt-4 mb-4">
      <p>{{ currentPassage.passage }}</p>
    </div>

    <!-- Question Display -->
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
      <p>Weighted Score: {{ weightedScoreValue.toFixed(2) }}/{{ questions.length }}</p>
      <p>Estimated Level: <strong>{{ estimatedLevel }}</strong></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { QuestionSet, Question } from '../types/quiz';

export default defineComponent({
  name: 'ReadingQuiz',
  setup() {
    const standalone = ref<Question[]>([]);
    const passages = ref<QuestionSet[]>([]);
    const longPassages = ref<QuestionSet[]>([]);

    const allQuestions: Ref<{ passage: string | null; question: Question }[]> = ref([]);

    const currentIndex = ref(0);
    const userAnswer = ref('');
    const score = ref(0);
    const weightedScoreValue = ref(0);
    const finished = ref(false);
    const timer = ref(0);
    const timerInterval = ref<number | null>(null);
    const timePerQuestion: number[] = [];
    const timeout = ref(false);
    const TIME_LIMIT = 25;

    const currentItem = computed(() => allQuestions.value[currentIndex.value]);
    const currentQuestion = computed(() => currentItem.value?.question);
    const currentPassage = computed(() => currentItem.value);
    const totalQuestions = computed(() => allQuestions.value.length);

    const startTimer = () => {
      timer.value = 0;
      timeout.value = false;
      timerInterval.value = setInterval(() => {
        timer.value++;
        if (timer.value >= TIME_LIMIT) {
          timeout.value = true;
          stopTimer();
        }
      }, 1000);
    };

    const stopTimer = () => {
      if (timerInterval.value !== null) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
        timePerQuestion.push(Math.min(timer.value, TIME_LIMIT));
      }
    };

    const next = () => {
      stopTimer();
      const timeTaken = Math.min(timer.value, TIME_LIMIT);
      const speedWeight = (TIME_LIMIT - timeTaken) / TIME_LIMIT; // 0.0〜1.0
      if (userAnswer.value === currentQuestion.value.answer) {
        score.value++;
        weightedScoreValue.value += 0.5 + 0.5 * speedWeight;
      }

      if (currentIndex.value + 1 < totalQuestions.value) {
        currentIndex.value++;
        userAnswer.value = '';
        startTimer();
      } else {
        finished.value = true;
      }
    };

    const averageTime = computed(() => {
      if (timePerQuestion.length === 0) return 0;
      return timePerQuestion.reduce((a, b) => a + b, 0) / timePerQuestion.length;
    });

    const estimatedLevel = computed(() => {
      const ratio = weightedScoreValue.value / totalQuestions.value;
      const avgTime = averageTime.value;
      const fullScore = score.value === totalQuestions.value;

      if (fullScore && avgTime < 9 && ratio >= 0.9) return 'C2';
      if (ratio >= 0.9) return 'C1';
      if (ratio >= 0.75) return 'B2';
      if (ratio >= 0.6) return 'B1';
      if (ratio >= 0.4) return 'A2';
      return 'A1';
    })

    onMounted(async () => {
      const res = await fetch('/questions/reading.json');
      const data = await res.json();
      standalone.value = data.standalone;
      passages.value = data.passages;
      longPassages.value = data.long_passages;

      const flatQuestions: { passage: string | null; question: Question }[] = [];
      standalone.value.forEach(q => flatQuestions.push({ passage: null, question: q }));
      passages.value.forEach(set => set.questions.forEach(q => flatQuestions.push({ passage: set.passage, question: q })));
      longPassages.value.forEach(set => set.questions.forEach(q => flatQuestions.push({ passage: set.passage, question: q })));
      allQuestions.value = flatQuestions;
      startTimer();
    })

    return {
      currentQuestion,
      currentPassage,
      currentIndex,
      userAnswer,
      score,
      weightedScoreValue,
      estimatedLevel,
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
.mt-4 {
  margin-top: 1rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
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