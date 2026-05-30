// FaceBomp game logic
// - Randomly pops images up and down
// - Click image to score
// - 30s countdown timer

const holes = Array.from(document.querySelectorAll('.hole'));
const moles = Array.from(document.querySelectorAll('.mole'));
const startButton = document.getElementById('startButton');
const scoreBoard = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const finalMessage = document.getElementById('finalMessage');
const board = document.getElementById('board');

// Audio elements (place files at the paths used in HTML)
const whacSound = document.getElementById('whacSound');
const cheerSound = document.getElementById('cheerSound');
const endSound = document.getElementById('endSound');

let lastHoleIndex = null;
let timeUp = false;
let score = 0;
let peepTimeout = null;
let countdownInterval = null;

// Pick a random time between min and max (ms)
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Choose a random hole index, ensuring it's not the same as last time
function randomHoleIndex() {
  const idx = Math.floor(Math.random() * holes.length);
  if (idx === lastHoleIndex) {
    return randomHoleIndex();
  }
  lastHoleIndex = idx;
  return idx;
}

// Show a mole for a random short duration, then hide it and schedule the next one
function peep() {
  const time = randomTime(600, 1200); // how long mole stays up
  const idx = randomHoleIndex();
  const mole = moles[idx];

  mole.classList.add('up');

  peepTimeout = setTimeout(() => {
    mole.classList.remove('up');
    // Keep going until time is up
    if (!timeUp) peep();
  }, time);
}

// Start the game: reset state, start peeping and countdown
function startGame() {
  clearTimeout(peepTimeout);
  clearInterval(countdownInterval);
  score = 0;
  scoreBoard.textContent = score;
  timeDisplay.textContent = 30;
  finalMessage.textContent = '';
  timeUp = false;

  peep();

  let timeLeft = 30;
  countdownInterval = setInterval(() => {
    timeLeft -= 1;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// End the game: stop scheduling, hide moles, and show final message
function endGame() {
  timeUp = true;
  clearTimeout(peepTimeout);
  clearInterval(countdownInterval);
  // Make sure all moles are down
  moles.forEach(m => m.classList.remove('up'));

  // witty message based on score
  let msg = '';
  if (score >= 25) msg = 'Amazing! You\'re a FaceBomp champion!';
  else if (score >= 15) msg = 'Great job! Those faces didn\'t stand a chance.';
  else if (score >= 7) msg = 'Nice effort — keep practicing that aim!';
  else msg = 'Oof — the faces got away this time. Try again!';

  finalMessage.textContent = `Time\'s up — final score: ${score}. ${msg}`;
  // Play end-of-game sound
  try {
    if (endSound) {
      endSound.currentTime = 0;
      endSound.play();
    }
  } catch (err) {}
}

// Handle clicking a mole: increase score and immediately hide that mole
function bonk(e) {
  // Prevent fake clicks (scripting)
  if (!e.isTrusted) return;
  // `this` should be the clicked mole when called via .call(),
  // but allow passing an event target as well.
  const moleEl = this instanceof Element ? this : e.target;
  if (!moleEl.classList.contains('up')) return; // only count when mole is visible

  // Visual feedback: add brief red border
  moleEl.classList.add('hit');
  setTimeout(() => moleEl.classList.remove('hit'), 150);

  score += 1;
  scoreBoard.textContent = score;
  if (score > 9 && cheerSound) {
    cheerSound.currentTime = 0;
    cheerSound.play();
  }

  // hide the mole immediately after a successful whac
  moleEl.classList.remove('up');

  // play whac sound (if available)
  try { if (whacSound) whacSound.currentTime = 0; if (whacSound) whacSound.play(); } catch (err) {}
}

// Wire up event listeners
startButton.addEventListener('click', () => startGame());

// Use event delegation on the board to make clicks more reliable
board.addEventListener('click', (e) => {
  const mole = e.target.closest('.mole');
  if (!mole) return;
  bonk.call(mole, e);
});

// Keyboard support: press Space to start
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    startGame();
  }
});
