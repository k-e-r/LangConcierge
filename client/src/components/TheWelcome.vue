<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'

</script>

<template>
  <WelcomeItem>
    <!-- <template #icon>
      <DocumentationIcon />
    </template> -->
    <template #heading>Instructions</template>

    <p>On this site, you can take English listening and reading tests.</p>
    <p>Based on your number of correct answers, you will receive feedback on your English level according to the CEFR scale.</p>
    ---

    <div class="Listening-test-section">
      <h3>Listening</h3>

      <p>In the Listening section, audio will play automatically.</p>
      <p>Listen carefully and choose the correct answer from the four options provided.</p>
      <p>Click the button below to start the test.</p>
      <p>Good luck!</p>

      <router-link to="/listening">
        <button class="test-button">Are you ready?</button>
      </router-link>
    </div>
    ---

    <div class="Listening-test-section">
      <h3>Reading</h3>

      <p>In the Reading section, choose the correct answer from four options for each question.</p>
      <p>Some questions include a long passage, so please read it carefully before answering.</p>
      <p>You’ve got this!</p>

      <router-link to="/reading">
        <button class="test-button">Let's go!</button>
      </router-link>
    </div>
  </WelcomeItem>
</template>

<style scoped>
p {
  overflow-wrap: break-word;
}

.Listening-test-section {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.Listening-test-section h3 {
  font-weight: 600;
}

.test-button {
  width: 100%;
  margin-top: 1rem;
  font-size: 1.2em;
  padding: 0.8em 2em;
  cursor: pointer;
  border: none;
  border-radius: 0.5em;
  background-color: #2b67f6;
  color: white;
  transition: background-color 0.3s ease;
}

.test-button:hover {
  background-color: #1a4fc3;
}
</style>
