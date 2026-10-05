const hero = document.querySelector('.hero');
const teddy = document.getElementById('teddy');
const bat = document.getElementById('batButton');
const action = document.getElementById('actionButton');
const speech = document.getElementById('speech');
const count = document.getElementById('hitCount');
const status = document.getElementById('status');
const effect = document.getElementById('sceneEffect');
const effectLabel = document.getElementById('effectLabel');
const effectWord = document.getElementById('effectWord');

const scenes = [
  { speech: 'Go on...<br>hit me again? 🥺', status: 'Tap the bat or the teddy for hit 1.' },
  { speech: 'Ouch! That stings! 🥺', status: 'Hit 1: teddy has a bruise and scratches.' },
  { speech: 'My head... I’m dizzy. 🩹', status: 'Hit 2: teddy holds a bumped head with a bandage.' },
  { speech: 'Okay... that really hurt. 😭', status: 'Hit 3: teddy falls over and cries.' },
  { speech: 'I got back up! Still cute, right? 🥹💗', status: 'Teddy got back up smiling. Give teddy a healing hug!' }
];

const effects = [
  null,
  { label: 'HIT 1', word: 'Ouch!' },
  { label: 'HIT 2', word: 'My head!' },
  { label: 'HIT 3', word: 'Waaah!' },
  { label: 'ALL BETTER', word: 'Still cute! ♡' }
];

let hits = 0;
let recovered = false;
let busy = false;
let effectTimer;

function render() {
  const stage = recovered ? 4 : hits;
  teddy.className = `teddy-button stage-${stage}`;
  hero.dataset.stage = String(stage);
  count.textContent = String(hits);
  speech.innerHTML = scenes[stage].speech;
  status.textContent = scenes[stage].status;

  const label = recovered ? 'Give teddy a healing hug' : `Swing the bat for hit ${hits + 1}`;
  bat.setAttribute('aria-label', label);
  teddy.setAttribute('aria-label', label);
  action.innerHTML = recovered
    ? '<span aria-hidden="true">🤍</span> Give teddy a healing hug'
    : '<span aria-hidden="true">🏏</span> Tap the bat &amp; smash!';
}

function hideEffect() {
  hero.classList.remove('show-effect');
  effect.setAttribute('aria-hidden', 'true');
}

function showEffect(stage) {
  window.clearTimeout(effectTimer);
  hideEffect();
  effectLabel.textContent = effects[stage].label;
  effectWord.textContent = effects[stage].word;
  hero.classList.remove('effect-1', 'effect-2', 'effect-3', 'effect-4');
  void hero.offsetWidth; // Replay the burst for each hit.
  hero.classList.add(`effect-${stage}`, 'show-effect');
  effect.setAttribute('aria-hidden', 'false');
  effectTimer = window.setTimeout(hideEffect, stage === 3 ? 2000 : 1600);
}

function advance() {
  if (busy) return;

  if (recovered) {
    recovered = false;
    hits = 0;
    hideEffect();
    hero.classList.remove('effect-4');
    render();
    speech.innerHTML = 'Aww... that feels much better! ♡';
    status.textContent = 'All healed. You can play again!';
    return;
  }

  busy = true;
  const next = hits + 1;
  hideEffect();
  window.clearTimeout(effectTimer);
  bat.classList.remove('swing-1', 'swing-2', 'swing-3');
  hero.classList.remove('hit-motion');
  void bat.offsetWidth;
  bat.classList.add(`swing-${next}`);
  hero.classList.add('hit-motion');

  window.setTimeout(() => {
    hits = next;
    render();
    showEffect(next);
  }, 380);

  window.setTimeout(() => {
    bat.classList.remove(`swing-${next}`);
    hero.classList.remove('hit-motion');
    if (next < 3) busy = false;
  }, 820);

  if (next === 3) {
    window.setTimeout(() => {
      recovered = true;
      render();
      showEffect(4);
      busy = false;
    }, 3550);
  }
}

bat.addEventListener('click', advance);
teddy.addEventListener('click', advance);
action.addEventListener('click', advance);
render();
