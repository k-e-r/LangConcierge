<template>
  <div>
    <h2>Reading Section</h2>
    <div v-if="currentQuestion">
      <p><strong>Q{{ currentIndex + 1 }}:</strong> {{ currentQuestion.text }}</p>
      <ul>
        <li v-for="(choice, i) in currentQuestion.choices" :key="i">
          <label>
            <input type="radio" :name="'q' + currentIndex" :value="choice" v-model="userAnswer" :disabled="finished" />
            {{ choice }}
          </label>
        </li>
      </ul>
    </div>

    <button @click="next" :disabled="!userAnswer || finished">Next</button>
    <p v-if="finished">You scored {{ score }}/{{ questions.length }}</p>
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

    const currentQuestion = computed(() => questions.value[currentIndex.value]);

    const next = () => {
      if (userAnswer.value === currentQuestion.value.answer) {
        score.value++;
      }

      if (currentIndex.value + 1 < questions.value.length) {
        currentIndex.value++;
        userAnswer.value = '';
      } else {
        finished.value = true;
      }
    }

    onMounted(async () => {
      const res = await fetch('/questions/reading.json');
      const data = await res.json();
      questions.value = data;
    })

    return {
      questions,
      currentQuestion,
      currentIndex,
      userAnswer,
      score,
      finished,
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