<template>
  <div>
    <ReadingQuiz
      :current-question="currentQuestion"
      :current-passage="currentPassage"
      :current-index="currentIndex"
      :user-answer="userAnswer"
      :score="score"
      :estimated-level="estimatedLevel"
      :finished="finished"
      :timer="timer"
      :timeout="timeout"
      :TIME-LIMIT="TIME_LIMIT"
      :total-questions="totalQuestions"
      @next="next"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import ReadingQuiz from '@/components/ReadingQuiz.vue';
import type { Ref } from 'vue';
import type { QuestionSet, Question } from '@/types/quiz';

export default defineComponent({
  name: 'ReadingView',
  components: { ReadingQuiz },
  setup() {
    const standalone = ref < Question[] > ([]);
    const passages = ref < QuestionSet[] > ([]);
    const longPassages = ref < QuestionSet[] > ([]);

    const allQuestions: Ref<{ passage: string | null; question: Question }[]> = ref([]);

    const currentIndex = ref(0);
    const userAnswer = ref('');
    const score = ref(0);
    const finished = ref(false);
    const timer = ref(0);
    const timerInterval: Ref<ReturnType<typeof setInterval> | null> = ref(null);
    const timePerQuestion: number[] = [];
    const timeout = ref(false);
    const TIME_LIMIT = 25;

    const currentItem = computed(() => allQuestions.value[currentIndex.value]);
    const currentQuestion = computed(() => currentItem.value?.question ?? null);
    const currentPassage = computed(() => currentItem.value ?? null);
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
      const speedWeight = (TIME_LIMIT - timeTaken) / TIME_LIMIT;
      if (userAnswer.value === currentQuestion.value.answer) {
        // if (speedWeight >= 0.4) score.value++;
        score.value++;
      }

      if (currentIndex.value + 1 < totalQuestions.value) {
        currentIndex.value++;
        userAnswer.value = '';
        startTimer();
      } else {
        finished.value = true;
      }
    };

    const estimatedLevel = computed(() => {
      const ratio = score.value / totalQuestions.value;

      if (ratio >= 0.9) return 'C2';
      if (ratio >= 0.8) return 'C1';
      if (ratio >= 0.7) return 'B2';
      if (ratio >= 0.5) return 'B1';
      if (ratio >= 0.4) return 'A2';
      return 'A1';
    });

    onMounted(async () => {
      const res = await fetch('/questions/reading.json');
      const data = await res.json();
      standalone.value = data.standalone;
      passages.value = data.passage;
      longPassages.value = data.long_passages;

      const flatQuestions: { passage: string | null; question: Question }[] = [];
      standalone.value.forEach(q => flatQuestions.push({ passage: null, question: q }));
      passages.value?.forEach(set => set.questions.forEach(q => flatQuestions.push({ passage: set.passage, question: q })));
      longPassages.value.forEach(set => set.questions.forEach(q => flatQuestions.push({ passage: set.passage, question: q })));
      allQuestions.value = flatQuestions;
      startTimer();
    });

    return {
      currentQuestion,
      currentPassage,
      currentIndex,
      userAnswer,
      score,
      estimatedLevel,
      finished,
      timer,
      timeout,
      TIME_LIMIT,
      totalQuestions,
      startTimer,
      stopTimer,
      allQuestions,
      next
    }
  }
});
</script>