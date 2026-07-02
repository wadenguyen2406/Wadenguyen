const noteBox = document.getElementById('noteBox');
const header = document.querySelector('.note-header');
const textarea = document.getElementById('noteInput');
const closeBtn = document.getElementById('closeBtn');
const toggleNoteBtn = document.getElementById('toggleNoteBtn');

const STORAGE_KEY = 'quick-note-position-and-content';

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveState() {
  const state = {
    left: noteBox.offsetLeft,
    top: noteBox.offsetTop,
    text: textarea.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyState(state) {
  if (!state) return;
  noteBox.style.left = `${Math.max(0, state.left)}px`;
  noteBox.style.top = `${Math.max(0, state.top)}px`;
  textarea.value = state.text || '';
}

header.addEventListener('pointerdown', (event) => {
  isDragging = true;
  noteBox.setPointerCapture(event.pointerId);
  offsetX = event.clientX - noteBox.offsetLeft;
  offsetY = event.clientY - noteBox.offsetTop;
  header.style.cursor = 'grabbing';
});

document.addEventListener('pointermove', (event) => {
  if (!isDragging) return;

  const nextX = event.clientX - offsetX;
  const nextY = event.clientY - offsetY;
  const maxX = window.innerWidth - noteBox.offsetWidth;
  const maxY = window.innerHeight - noteBox.offsetHeight;

  noteBox.style.left = `${Math.min(Math.max(0, nextX), maxX)}px`;
  noteBox.style.top = `${Math.min(Math.max(0, nextY), maxY)}px`;
});

document.addEventListener('pointerup', () => {
  if (!isDragging) return;
  isDragging = false;
  header.style.cursor = 'grab';
  saveState();
});

closeBtn.addEventListener('click', () => {
  noteBox.classList.add('hidden');
});

toggleNoteBtn.addEventListener('click', () => {
  noteBox.classList.toggle('hidden');
});

textarea.addEventListener('input', saveState);
window.addEventListener('load', () => {
  applyState(loadState());
});
