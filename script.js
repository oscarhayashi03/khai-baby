const questions = [
  {
    type: 'Warm-up',
    text: 'Pick the ultimate snow-day breakfast.',
    options: [
      { text: 'Fluffy pancakes', correct: true },
      { text: 'Plain toast', correct: false },
      { text: 'Cold cereal', correct: false },
    ],
  },
  {
    type: 'Warm-up',
    text: 'Choose the cozy drink to sip before we head out.',
    options: [
      { text: 'Hot chocolate with whipped cream', correct: true },
      { text: 'Iced lemonade', correct: false },
      { text: 'Plain water', correct: false },
    ],
  },
  {
    type: 'Warm-up',
    text: 'Which winter activity should happen first?',
    options: [
      { text: 'Ice skating', correct: true },
      { text: 'Mowing the lawn', correct: false },
      { text: 'Swimming laps', correct: false },
    ],
  },
  {
    type: 'Warm-up',
    text: 'Best accessory to match our outfits?',
    options: [
      { text: 'Coordinated scarves', correct: true },
      { text: 'Random socks', correct: false },
      { text: 'Baseball caps', correct: false },
    ],
  },
  {
    type: 'Warm-up',
    text: 'Pick a soundtrack for getting ready.',
    options: [
      { text: 'Slow dance playlist', correct: true },
      { text: 'Heavy metal sirens', correct: false },
      { text: 'Fire alarm test', correct: false },
    ],
  },
  {
    type: 'Warm-up',
    text: 'Choose the dessert to share afterward.',
    options: [
      { text: 'Molten lava cake', correct: true },
      { text: 'Plain crackers', correct: false },
      { text: 'Kale chips', correct: false },
    ],
  },
  {
    type: 'Warm-up',
    text: 'Which winter treat belongs in the mug?',
    options: [
      { text: 'Marshmallows', correct: true },
      { text: 'Pickles', correct: false },
      { text: 'Ketchup packets', correct: false },
    ],
  },
  {
    type: 'Warm-up',
    text: 'Pick the ride to the venue.',
    options: [
      { text: 'Sleigh (or ride share)', correct: true },
      { text: 'Tractor', correct: false },
      { text: 'Scooter with no wheels', correct: false },
    ],
  },
  {
    type: 'Warm-up',
    text: 'Select the color theme for the night.',
    options: [
      { text: 'Midnight blue + gold', correct: true },
      { text: 'Neon camo', correct: false },
      { text: 'Mud brown', correct: false },
    ],
  },
  {
    type: 'Final ask',
    text: 'Do you want to go to winter formal with me? (Hot cocoa says yes.)',
    options: [
      { text: 'Yes', correct: true },
      { text: 'Yes, obviously', correct: true },
    ],
    final: true,
  },
];

const totalQuestions = questions.length;
let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let selectedOptionCorrect = false;
let marshmallowCount = 0;
const usedPositions = [];

const questionNumber = document.querySelector('#question-number');
const progressFill = document.querySelector('#progress-fill');
const questionType = document.querySelector('#question-type');
const questionText = document.querySelector('#question-text');
const optionsContainer = document.querySelector('#options');
const optionTemplate = document.querySelector('#option-template');
const feedback = document.querySelector('#feedback');
const submitButton = document.querySelector('#submit');
const quizSection = document.querySelector('.quiz');
const revealSection = document.querySelector('.reveal');
const celebrateButton = document.querySelector('#celebrate');
const revealFeedback = document.querySelector('#reveal-feedback');
const marshmallowCountEl = document.querySelector('#marshmallow-count');
const marshmallowPool = document.querySelector('#marshmallow-pool');
const marshmallowTemplate = document.querySelector('#marshmallow-template');
const confettiTemplate = document.querySelector('#confetti-template');

function updateStatusDisplays() {
  questionNumber.textContent = (currentQuestionIndex + 1).toString();
  const percent = (marshmallowCount / totalQuestions) * 100;
  progressFill.style.width = `${percent}%`;
  marshmallowCountEl.textContent = marshmallowCount.toString();
}

function renderQuestion() {
  const current = questions[currentQuestionIndex];
  questionType.textContent = current.type;
  questionText.textContent = current.text;
  optionsContainer.innerHTML = '';
  selectedOptionIndex = null;
  selectedOptionCorrect = false;
  submitButton.disabled = true;
  feedback.textContent = '';

  const optionPool = current.final
    ? [...current.options]
    : shuffleArray([...current.options]);

  optionPool.forEach((option, index) => {
    const optionNode = optionTemplate.content.firstElementChild.cloneNode(true);
    optionNode.textContent = option.text;
    optionNode.addEventListener('click', () => {
      selectedOptionIndex = index;
      selectedOptionCorrect = option.correct;
      optionsContainer.querySelectorAll('.option').forEach((btn) => {
        btn.classList.remove('selected');
      });
      optionNode.classList.add('selected');
      submitButton.disabled = false;
    });
    optionsContainer.appendChild(optionNode);
  });

  updateStatusDisplays();
  if (current.final) {
    celebrateMarshmallows();
  } else {
    calmMarshmallows();
  }
}

function addMarshmallow() {
  if (!marshmallowTemplate?.content) return;
  const marshmallow = marshmallowTemplate.content.firstElementChild.cloneNode(true);
  const position = findOpenPosition();
  const dx = (Math.random() * 12 - 6).toFixed(2);
  const dy = (Math.random() * 10 - 5).toFixed(2);
  const duration = (4 + Math.random() * 2).toFixed(2);
  const delay = (Math.random() * 1.5).toFixed(2);
  marshmallow.style.setProperty('--x', `${position.left}%`);
  marshmallow.style.setProperty('--y', `${position.top}%`);
  marshmallow.style.setProperty('--dx', `${dx}px`);
  marshmallow.style.setProperty('--dy', `${dy}px`);
  marshmallow.style.setProperty('--duration', `${duration}s`);
  marshmallow.style.setProperty('--delay', `${delay}s`);
  marshmallow.style.setProperty('--party-delay', `${(Math.random() * 0.8).toFixed(2)}s`);
  marshmallow.dataset.face = randomFaceVariant();
  attachMarshmallowInteractions(marshmallow);
  if (questions[currentQuestionIndex]?.final) {
    marshmallow.dataset.face = 'smile';
    marshmallow.classList.add('party');
  }
  marshmallowPool.appendChild(marshmallow);
}

function attachMarshmallowInteractions(node) {
  const wobble = () => {
    const swayX = (Math.random() * 12 - 6).toFixed(2);
    const swayY = (Math.random() * 8 - 4).toFixed(2);
    node.style.transform = `translate(${swayX}px, ${swayY}px) scale(1.05)`;
  };

  node.addEventListener('mouseenter', () => {
    node.dataset.hovering = 'true';
    node.style.animationPlayState = 'paused';
    node.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.25)';
    wobble();
  });

  node.addEventListener('mousemove', () => {
    if (node.dataset.hovering === 'true') {
      wobble();
    }
  });

  node.addEventListener('mouseleave', () => {
    node.dataset.hovering = 'false';
    node.style.animationPlayState = '';
    node.style.transform = '';
    node.style.boxShadow = '';
  });
}

function randomFaceVariant() {
  const roll = Math.random();
  if (roll < 0.3) {
    return 'blink';
  }
  if (roll < 0.6) {
    return 'wow';
  }
  return 'smile';
}

function findOpenPosition() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const left = 6 + Math.random() * 80;
    const top = 8 + Math.random() * 68;
    const tooClose = usedPositions.some((pos) => {
      const distance = Math.hypot(left - pos.left, top - pos.top);
      return distance < 20;
    });
    if (!tooClose) {
      const chosen = { left, top };
      usedPositions.push(chosen);
      return chosen;
    }
  }
  // fallback: scatter around existing ones by nudging random slot
  const fallback = {
    left: 10 + Math.random() * 75,
    top: 10 + Math.random() * 60,
  };
  usedPositions.push(fallback);
  return fallback;
}

function handleCorrectAnswer(current) {
  marshmallowCount = Math.min(marshmallowCount + 1, totalQuestions);
  addMarshmallow();
  updateStatusDisplays();

  if (current.final) {
    feedback.textContent = 'Cup full! One more click...';
    setTimeout(showFinalReveal, 500);
    return;
  }

  currentQuestionIndex += 1;
  setTimeout(() => {
    renderQuestion();
  }, 400);
}

function showFinalReveal() {
  quizSection.hidden = true;
  revealSection.hidden = false;
  revealFeedback.textContent = '';
  fireConfetti();
}

submitButton?.addEventListener('click', () => {
  if (selectedOptionIndex === null) {
    feedback.textContent = 'Pick an option first!';
    return;
  }

  const current = questions[currentQuestionIndex];
  if (!selectedOptionCorrect) {
    feedback.textContent = 'Close, but the cocoa disagrees. Try another option!';
    return;
  }

  feedback.textContent = 'Marshmallow earned!';
  submitButton.disabled = true;
  handleCorrectAnswer(current);
});

celebrateButton?.addEventListener('click', () => {
  window.location.href = 'bouquet.html';
});

function fireConfetti() {
  if (!confettiTemplate?.content) return;
  const pieces = 28;
  for (let i = 0; i < pieces; i += 1) {
    const confetti = confettiTemplate.content.firstElementChild.cloneNode(true);
    const hue = 190 + Math.random() * 80;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = `linear-gradient(180deg, hsl(${hue}, 80%, 70%), hsl(${hue + 30}, 90%, 60%))`;
    confetti.style.animationDelay = `${Math.random() * 0.8}s`;
    document.body.appendChild(confetti);
    confetti.addEventListener('animationend', () => confetti.remove());
  }
}

function celebrateMarshmallows() {
  marshmallowPool.querySelectorAll('.marshmallow').forEach((node) => {
    node.classList.add('party');
    node.dataset.face = 'smile';
  });
}

function calmMarshmallows() {
  marshmallowPool.querySelectorAll('.marshmallow').forEach((node) => {
    node.classList.remove('party');
  });
}

function shuffleArray(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

renderQuestion();
