const setupScreen = document.querySelector('#setup-screen');
const gameScreen = document.querySelector('#game-screen');
const startButton = document.querySelector('#start-button');
const stage = document.querySelector('#stage');
const doll = document.querySelector('#doll');
const count = document.querySelector('#tap-count');
const labelInput = document.querySelector('#label-input');
const dollName = document.querySelector('#doll-name');
const dialogueTail = document.querySelector('#dialogue-tail');
const sceneMessage = document.querySelector('#scene-message');
const reset = document.querySelector('#reset-button');
const avatarInput = document.querySelector('#avatar-input');
const avatarPick = document.querySelector('#avatar-pick');
const avatarStatus = document.querySelector('#avatar-status');
const avatarPreview = document.querySelector('#avatar-preview');
const avatarBadge = document.querySelector('#avatar-badge');
const frames = [...document.querySelectorAll('.scene-frame')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const dialogueTails = ['我打到你腰骨坐不定！', '我打到你舌根流口水！'];
let jabs = 0;
let pendingSwats = 0;
let isAnimating = false;
let avatarUrl = '';

function showFrame(name) {
  frames.forEach((frame) => frame.classList.toggle('is-active', frame.dataset.frame === name));
}

function updateDollName() {
  dollName.textContent = labelInput.value.trim() || '這個煩惱';
}

function chooseAvatar(file) {
  if (!file || !file.type.startsWith('image/')) return;
  if (avatarUrl) URL.revokeObjectURL(avatarUrl);
  avatarUrl = URL.createObjectURL(file);
  avatarPreview.innerHTML = `<img src="${avatarUrl}" alt="已選擇的頭像" />`;
  avatarBadge.src = avatarUrl;
  avatarBadge.hidden = false;
  avatarStatus.textContent = '頭像已選好';
}

avatarPick.addEventListener('click', () => avatarInput.click());
avatarInput.addEventListener('change', () => chooseAvatar(avatarInput.files[0]));
labelInput.addEventListener('input', updateDollName);

startButton.addEventListener('click', () => {
  updateDollName();
  setupScreen.hidden = true;
  gameScreen.hidden = false;
  showFrame('preparation');
});

function playNextSwat() {
  if (isAnimating || pendingSwats < 1) return;
  isAnimating = true;
  pendingSwats -= 1;
  sceneMessage.classList.add('show-dialogue');
  showFrame('preparation');
  const impactDelay = reduceMotion.matches ? 20 : 170;
  const recoilDelay = reduceMotion.matches ? 70 : 470;
  const finishDelay = reduceMotion.matches ? 150 : 930;
  window.setTimeout(() => showFrame('impact'), impactDelay);
  window.setTimeout(() => showFrame('recoil'), recoilDelay);
  window.setTimeout(() => {
    showFrame('preparation');
    sceneMessage.classList.remove('show-dialogue');
    isAnimating = false;
    playNextSwat();
  }, finishDelay);
}

doll.addEventListener('click', () => {
  jabs += 1;
  pendingSwats += 1;
  count.textContent = jabs;
  dollName.textContent = labelInput.value.trim() || '這個煩惱';
  dialogueTail.textContent = dialogueTails[(jabs - 1) % dialogueTails.length];
  playNextSwat();
});

reset.addEventListener('click', () => {
  pendingSwats = 0;
  isAnimating = false;
  jabs = 0;
  count.textContent = '0';
  showFrame('preparation');
  sceneMessage.classList.remove('show-dialogue');
  if (avatarUrl) URL.revokeObjectURL(avatarUrl);
  avatarUrl = '';
  avatarBadge.removeAttribute('src');
  avatarBadge.hidden = true;
  avatarPreview.innerHTML = '<span>頭像預覽</span>';
  avatarStatus.textContent = '也可以從相簿選一張照片';
  avatarInput.value = '';
  labelInput.value = '';
  updateDollName();
  dialogueTail.textContent = dialogueTails[0];
  gameScreen.hidden = true;
  setupScreen.hidden = false;
  labelInput.focus();
});
