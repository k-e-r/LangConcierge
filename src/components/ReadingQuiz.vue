<script lang="ts" setup>
import { defineProps } from 'vue';
import type { ReadingQuizProps } from '@/types/ReadingQuizProps';

const props = defineProps<ReadingQuizProps>();
</script>

<template>
  <div>
    <p><em>Time left: {{ props.TIME_LIMIT - props.timer }}s</em></p>

    <!-- Passage Display -->
    <div v-if="props.currentPassage" class="mt-4 mb-4">
      <p>{{ props.currentPassage.passage }}</p>
    </div>

    <!-- Question Display -->
    <div v-if="props.currentQuestion">
      <p><strong>Q{{ props.currentIndex + 1 }}:</strong> {{ props.currentQuestion.text }}</p>
      <ul>
        <li v-for="(choice, i) in props.currentQuestion.choices" :key="i">
          <label>
            <input type="radio" :name="'q' + props.currentIndex" :value="choice" v-model="props.userAnswer" :disabled="props.finished || props.timeout" />
            {{ choice }}
          </label>
        </li>
      </ul>
    </div>

    <button @click="$emit('next')" :disabled="!props.userAnswer && !props.timeout || props.finished">
      <div v-if="props.finished">
        <p>You scored {{ props.score }}/{{ props.totalQuestions }}</p>
        <p>Average Time: {{ props.averageTime.toFixed(2) }}s/question</p>
        <p>Weighted Score: {{ props.weightedScoreValue.toFixed(2) }}/{{ props.totalQuestions }}</p>
        <p>Estimated Level: <strong>{{ props.estimatedLevel }}</strong></p>
      </div>
    </button>
  </div>
</template>

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
