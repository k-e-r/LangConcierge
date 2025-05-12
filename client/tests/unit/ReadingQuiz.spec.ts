import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ReadingQuiz from '../../src/components/ReadingQuiz.vue';
import type { ReadingQuizProps } from '@/types/ReadingQuizProps';

const baseProps: ReadingQuizProps = {
  currentQuestion: {
    text: "Why is recycling important?",
    choices: ["It saves money", "It reduces waste", "It increases pollution", "It is mandatory"],
    answer: "It reduces waste"
  },
  currentPassage: null,
  currentIndex: 0,
  userAnswer: "",
  score: 0,
  estimatedLevel: "A1",
  finished: false,
  timer: 0,
  timeout: false,
  TIME_LIMIT: 25,
  totalQuestions: 1
}

describe('ReadingQuiz.vue', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders question text', () => {
    const wrapper = mount(ReadingQuiz, {
      props: { ...baseProps }
    });
    expect(wrapper.text()).toContain("Why is recycling important?");
  });

  it('estimates C2 level under right conditions', () => {
    const wrapper = mount(ReadingQuiz, {
      props: {
        ...baseProps,
        score: 1,
        timePerQuestion: 5,
        estimatedLevel: "C2",
        finished: true
      }
    });
    expect(wrapper.text()).toContain("C2");
  });

  it('shows timer counting', async () => {
    const wrapper = mount(ReadingQuiz, {
      props: { ...baseProps, timer: 0 }
    });
    expect(wrapper.text()).toContain("Time left: 25s");
  });
})