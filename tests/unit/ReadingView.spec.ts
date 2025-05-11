
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReadingView from '../../src/views/ReadingView.vue'

describe('ReadingView.vue', () => {
  let wrapper: any;

  beforeEach(async () => {
    // Proper fetch mock using vi.stubGlobal
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          standalone: [
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            },
            {
              text: 'Sample Q',
              choices: ['A'],
              answer: 'A'
            }
          ],
          passages: [],
          long_passages: []
        })
      })
    ) as any);

    wrapper = mount(ReadingView, {
      global: {
        stubs: {
          ReadingQuiz: {
            template: '<div />',
            props: ['TIME_LIMIT']
          }
        }
      }
    });
  })

  afterEach(() => {
    wrapper.vm?.stopTimer?.();
    vi.useRealTimers();
  })

  it('calculates estimated level as C2 when full score and fast response', () => {
    wrapper.vm.score = 10;
    wrapper.vm.timePerQuestion = [5];
    wrapper.vm.finished = true;
    expect(wrapper.vm.estimatedLevel).toBe('C2');
  })

  it('calculates estimated level as B2 when score is high and average response', () => {
    wrapper.vm.score = 8;
    wrapper.vm.timePerQuestion = [15];
    wrapper.vm.finished = true;
    expect(wrapper.vm.estimatedLevel).toBe('C1');
  })

  it('calculates estimated level as B2 when score is high and average response', () => {
    wrapper.vm.score = 7;
    wrapper.vm.timePerQuestion = [15];
    wrapper.vm.finished = true;
    expect(wrapper.vm.estimatedLevel).toBe('B2');
  })

  it('calculates estimated level as B1 when score is medium and average response', () => {
    wrapper.vm.score = 5;
    wrapper.vm.timePerQuestion = [15];
    wrapper.vm.finished = true;
    expect(wrapper.vm.estimatedLevel).toBe('B1');
  })

  it('calculates estimated level as A2 when score is low and average response', () => {
    wrapper.vm.score = 4;
    wrapper.vm.timePerQuestion = [15];
    wrapper.vm.finished = true;
    expect(wrapper.vm.estimatedLevel).toBe('A2');
  })

  it('calculates estimated level as A1 when score is low', () => {
    wrapper.vm.score = 0;
    wrapper.vm.timePerQuestion = [25];
    wrapper.vm.finished = true;
    expect(wrapper.vm.estimatedLevel).toBe('A1');
  })

  it('advances to next question and updates score', () => {
    wrapper.vm.userAnswer = 'A';
    wrapper.vm.next();
    expect(wrapper.vm.score).toBe(1);
    expect(wrapper.vm.currentIndex).toBe(1);
    expect(wrapper.vm.finished).toBe(false);
  })

  it('advances to next question and updates score2', () => {
    const total = wrapper.vm.allQuestions.length;

    for (let i = 0; i < total; i++) {
      wrapper.vm.userAnswer = 'A';
      wrapper.vm.next();
    }

    expect(wrapper.vm.score).toBe(total);
    expect(wrapper.vm.currentIndex).toBe(total - 1);
    expect(wrapper.vm.finished).toBe(true);
  })

  it('does not update score when incorrect choice is selected', () => {
    wrapper.vm.userAnswer = 'B';
    wrapper.vm.next();
    expect(wrapper.vm.score).toBe(0);
  })

  it('starts and stops timer correctly', () => {
    vi.useFakeTimers();

    wrapper.vm.startTimer();
    vi.advanceTimersByTime(3000);
    expect(wrapper.vm.timer).toBe(3);
    wrapper.vm.stopTimer();
    expect(wrapper.vm.timer).toBe(3); // still 3, timer stopped
  })
})
