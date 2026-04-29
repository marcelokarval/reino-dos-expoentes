const logger = window.logger;

const levels = [
  { name: '1. FLORESTA DOS PRODUTOS', icon: '🌲👾', property: 'multiplication', rule: 'aᵐ · aⁿ = aᵐ⁺ⁿ', diff: 4, time: 0 },
  { name: '2. CAVERNA DAS DIVISÕES', icon: '🦇👾', property: 'division', rule: 'aᵐ / aⁿ = aᵐ⁻ⁿ', diff: 5, time: 0 },
  { name: '3. TORRE DAS POTÊNCIAS', icon: '🏰👻', property: 'powerOfPower', rule: '(aᵐ)ⁿ = aᵐ˙ⁿ', diff: 6, time: 0 },
  { name: '4. DESERTO DO ZERO', icon: '🏜️🦂', property: 'zeroExponent', rule: 'a⁰ = 1', diff: 7, time: 0 },
  { name: '5. ABISMO NEGATIVO', icon: '🌑👹', property: 'negative', rule: 'a⁻ⁿ = 1/aⁿ', diff: 8, time: 15 },
  { name: '6. TRONO DO CAOS', icon: '👑🔥', property: 'complex', rule: 'Mistura Total!', diff: 10, time: 12 },
];

let currentLevelIndex = 0;
let playerHP = 100;
let enemyHP = 100;
let currentQuestion = {};
let isTransitioning = false;
let combo = 0;
let inventory = { potions: 1, scrollProduct: 1, scrollDivision: 1, scrollNegative: 1 };
let missionTarget = 5;
let missionCurrent = 0;
let activeShield = false;
let timerInterval = null;
let timeLeft = 0;

function getElement(id) {
  return document.getElementById(id);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function setCenteredBody(isCentered) {
  document.body.classList.toggle('centered', isCentered);
}

function startGame() {
  logger.info('Game', 'Adventure started');
  getElement('main-menu').classList.add('hidden');
  getElement('game-ui').classList.remove('hidden');
  setCenteredBody(false);
  initLevel();
}

function initLevel() {
  missionCurrent = 0;
  enemyHP = 100;
  isTransitioning = false;
  currentQuestion = generateQuestion();
  logger.debug('Game', 'Level initialized', { level: levels[currentLevelIndex].name });
  updateUI();
  startTimer();
}

function startTimer() {
  stopTimer();
  const level = levels[currentLevelIndex];

  if (level.time > 0) {
    timeLeft = level.time;
    updateTimerBar();
    timerInterval = setInterval(() => {
      timeLeft -= 0.1;
      updateTimerBar();
      if (timeLeft <= 0) {
        handleTimeOut();
      }
    }, 100);
    return;
  }

  getElement('timer-bar').style.width = '0%';
}

function updateTimerBar() {
  const level = levels[currentLevelIndex];
  if (!level.time) {
    getElement('timer-bar').style.width = '0%';
    return;
  }

  const percent = Math.max(0, (timeLeft / level.time) * 100);
  getElement('timer-bar').style.width = `${percent}%`;
}

function handleTimeOut() {
  if (isTransitioning) return;

  isTransitioning = true;
  stopTimer();
  playerHP -= 10;
  logger.warn('Game', 'Question timed out', { playerHP });
  getElement('feedback').innerHTML = "<span class='wrong'>⏰ TEMPO ESGOTADO! -10 HP</span>";
  getElement('game-container').classList.add('shake', 'flash-red');
  updateUI();

  if (playerHP <= 0) {
    gameOver();
    return;
  }

  setTimeout(() => {
    getElement('game-container').classList.remove('shake', 'flash-red');
    currentQuestion = generateQuestion();
    updateUI();
    startTimer();
    isTransitioning = false;
  }, 1000);
}

function generateQuestion() {
  const level = levels[currentLevelIndex];
  const base = Math.floor(Math.random() * 5) + 2;
  const m = Math.floor(Math.random() * level.diff) + 1;
  const n = Math.floor(Math.random() * level.diff) + 1;
  let text = '';
  let correctValue = 0;

  switch (level.property) {
    case 'multiplication':
      text = `${base}<sup>${m}</sup> · ${base}<sup>${n}</sup> = ${base}<sup>?</sup>`;
      correctValue = m + n;
      break;
    case 'division':
      text = `${base}<sup>${m + n}</sup> / ${base}<sup>${n}</sup> = ${base}<sup>?</sup>`;
      correctValue = m;
      break;
    case 'powerOfPower':
      text = `(${base}<sup>${m}</sup>)<sup>${n}</sup> = ${base}<sup>?</sup>`;
      correctValue = m * n;
      break;
    case 'zeroExponent': {
      const randBase = Math.floor(Math.random() * 99) + 1;
      text = `${randBase}<sup>0</sup> = ?`;
      correctValue = 1;
      break;
    }
    case 'negative':
      text = `1 / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
      correctValue = -m;
      break;
    case 'complex':
      text = `(${base}<sup>${m}</sup> · ${base}<sup>${n}</sup>) / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
      correctValue = n;
      break;
    default:
      logger.error('Game', 'Unknown level property', { property: level.property });
  }

  const options = [correctValue];
  while (options.length < 4) {
    const fake = correctValue + Math.floor(Math.random() * 10) - 5;
    if (!options.includes(fake)) options.push(fake);
  }

  options.sort(() => Math.random() - 0.5);
  return { text, correctValue, options };
}

function updateUI() {
  const level = levels[currentLevelIndex];
  getElement('stage-name').innerText = level.name;
  getElement('monster-icon').innerText = level.icon;
  getElement('question-text').innerHTML = currentQuestion.text;
  getElement('combo-text').innerText = `COMBO: ${combo}`;
  getElement('potion-count').innerText = inventory.potions;
  getElement('count-prod').innerText = inventory.scrollProduct;
  getElement('count-div').innerText = inventory.scrollDivision;
  getElement('count-neg').innerText = inventory.scrollNegative;
  getElement('mission-progress').innerText = `${missionCurrent}/${missionTarget}`;
  getElement('mission-bar').style.width = `${(missionCurrent / missionTarget) * 100}%`;

  const optionsDiv = getElement('options');
  optionsDiv.innerHTML = '';
  currentQuestion.options.forEach((option) => {
    const button = document.createElement('button');
    button.innerText = option;
    button.type = 'button';
    button.addEventListener('click', () => handleAnswer(option));
    optionsDiv.appendChild(button);
  });

  getElement('player-hp').style.width = `${Math.max(0, playerHP)}%`;
  getElement('enemy-hp').style.width = `${Math.max(0, enemyHP)}%`;
}

function handleAnswer(selected) {
  if (isTransitioning) return;

  isTransitioning = true;
  stopTimer();
  const feedback = getElement('feedback');
  const monster = getElement('monster-icon');

  if (selected === currentQuestion.correctValue) {
    combo++;
    missionCurrent = Math.min(missionTarget, missionCurrent + 1);
    const damage = combo >= 3 ? 22 : 18;
    feedback.innerHTML = combo >= 3
      ? "<span class='correct'>🔥 CRÍTICO!</span>"
      : "<span class='correct'>💥 ACERTOU!</span>";
    enemyHP -= damage;
    logger.info('Game', 'Correct answer', { combo, damage, enemyHP, missionCurrent });
    monster.classList.add('hit-enemy');
    setTimeout(() => monster.classList.remove('hit-enemy'), 400);

    if (enemyHP <= 0) {
      setTimeout(() => {
        showVictory();
        isTransitioning = false;
      }, 600);
      return;
    }
  } else {
    combo = 0;
    const damageTaken = activeShield ? 5 : 20;
    if (activeShield) {
      activeShield = false;
      getElement('game-container').classList.remove('shield-active');
    }

    playerHP -= damageTaken;
    logger.warn('Game', 'Wrong answer', { selected, correctValue: currentQuestion.correctValue, playerHP });
    feedback.innerHTML = `<span class="wrong">⚠️ ERROU! Regra: ${levels[currentLevelIndex].rule}</span>`;
    getElement('game-container').classList.add('shake', 'flash-red');
    setTimeout(() => getElement('game-container').classList.remove('shake', 'flash-red'), 500);

    if (playerHP <= 0) {
      gameOver();
      return;
    }
  }

  setTimeout(() => {
    feedback.innerHTML = '';
    currentQuestion = generateQuestion();
    updateUI();
    startTimer();
    isTransitioning = false;
  }, 1500);
}

function useScroll(type) {
  if (isTransitioning) return;

  if (type === 'product' && inventory.scrollProduct > 0) {
    inventory.scrollProduct--;
    logger.info('Inventory', 'Product scroll used');
    handleAnswer(currentQuestion.correctValue);
  } else if (type === 'division' && inventory.scrollDivision > 0) {
    inventory.scrollDivision--;
    enemyHP -= 25;
    logger.info('Inventory', 'Division scroll used', { enemyHP });
    getElement('feedback').innerHTML = "<span style='color:var(--scroll-color)'>✨ DANO MÁGICO!</span>";
    updateUI();
    if (enemyHP <= 0) showVictory();
  } else if (type === 'negative' && inventory.scrollNegative > 0) {
    inventory.scrollNegative--;
    activeShield = true;
    logger.info('Inventory', 'Negative exponent shield used');
    getElement('game-container').classList.add('shield-active');
    updateUI();
  }
}

function usePotion() {
  if (isTransitioning || inventory.potions <= 0) return;

  inventory.potions--;
  logger.info('Inventory', 'Potion used');
  document.querySelectorAll('#options button').forEach((button) => {
    if (parseInt(button.innerText, 10) === currentQuestion.correctValue) {
      button.classList.add('highlight-correct');
    }
  });
  getElement('potion-count').innerText = inventory.potions;
}

function showVictory() {
  stopTimer();
  logger.info('Game', 'Level completed', { level: levels[currentLevelIndex].name, missionCurrent });
  getElement('game-ui').classList.add('hidden');
  getElement('victory-screen').classList.remove('hidden');
  getElement('reward-text').innerHTML = `Regra Dominada: ${levels[currentLevelIndex].rule}`;

  if (missionCurrent >= missionTarget) {
    getElement('conquest-alert').innerText = '📜 Missão Concluída! Itens Restaurados!';
    inventory.scrollProduct++;
    inventory.scrollDivision++;
    inventory.scrollNegative++;
  } else {
    getElement('conquest-alert').innerText = '';
  }
}

function nextLevel() {
  currentLevelIndex++;
  if (currentLevelIndex >= levels.length) {
    alert('VOCÊ CONQUISTOU O TRONO DOS EXPOENTES!');
    window.location.reload();
    return;
  }

  getElement('victory-screen').classList.add('hidden');
  getElement('game-ui').classList.remove('hidden');
  playerHP = 100;
  initLevel();
}

function gameOver() {
  stopTimer();
  logger.warn('Game', 'Game over');
  alert('GAME OVER! Tente novamente.');
  window.location.reload();
}

function bindControls() {
  getElement('start-button').addEventListener('click', startGame);
  getElement('next-level-button').addEventListener('click', nextLevel);
  getElement('scroll-product-button').addEventListener('click', () => useScroll('product'));
  getElement('scroll-division-button').addEventListener('click', () => useScroll('division'));
  getElement('scroll-negative-button').addEventListener('click', () => useScroll('negative'));
  getElement('potion-button').addEventListener('click', usePotion);
}

document.addEventListener('DOMContentLoaded', () => {
  bindControls();
  setCenteredBody(true);
  logger.info('App', 'Reino dos Expoentes loaded');
});
