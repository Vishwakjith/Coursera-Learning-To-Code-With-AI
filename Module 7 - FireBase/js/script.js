import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  onValue,
  runTransaction,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

const firebaseConfig = {
	apiKey: "AIzaSyBW-G0XbgbJEWJToaZsWq_OlUYoQ4v-EDU",
	authDomain: "fir-playground-35782.firebaseapp.com",
	projectId: "fir-playground-35782",
	storageBucket: "fir-playground-35782.firebasestorage.app",
	messagingSenderId: "106073510415",
	appId: "1:106073510415:web:123d1753930884135ac97a",
	databaseURL: "https://fir-playground-35782-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'messages');

const statusElement = document.getElementById('status');
const form = document.getElementById('message-form');
const deleteAllButton = document.getElementById('delete-all');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const messagesContainer = document.getElementById('messages');

function updateStatus(text, isError = false) {
  statusElement.textContent = text;
  statusElement.style.color = isError ? '#b91c1c' : '#1d4ed8';
  statusElement.style.background = isError ? '#fee2e2' : '#eef2ff';
}

function validateConfig(config) {
  return Object.values(config).every(
    (value) => value && !value.includes('YOUR_')
  );
}

function createMessageElement(id, entry) {
  const messageElement = document.createElement('article');
  messageElement.className = 'message-item';

  const header = document.createElement('div');
  header.className = 'message-header';
  header.innerHTML = `
    <span>${entry.name}</span>
    <time>${new Date(entry.timestamp).toLocaleString()}</time>
  `;

  const body = document.createElement('p');
  body.className = 'message-body';
  body.textContent = entry.text;

  const actions = document.createElement('div');
  actions.className = 'message-actions';

  const likeButton = document.createElement('button');
  likeButton.type = 'button';
  likeButton.className = 'reaction-button';
  likeButton.textContent = `👍 ${entry.likes || 0}`;
  likeButton.addEventListener('click', () => updateReaction(id, 'likes'));

  const dislikeButton = document.createElement('button');
  dislikeButton.type = 'button';
  dislikeButton.className = 'reaction-button';
  dislikeButton.textContent = `👎 ${entry.dislikes || 0}`;
  dislikeButton.addEventListener('click', () => updateReaction(id, 'dislikes'));

  actions.append(likeButton, dislikeButton);
  messageElement.append(header, body, actions);
  return messageElement;
}

function renderMessages(dataSnapshot) {
  const messages = dataSnapshot.val();
  messagesContainer.innerHTML = '';

  if (!messages) {
    messagesContainer.innerHTML = '<p class="empty">No messages found yet. Publish one above.</p>';
    return;
  }

  const entries = Object.entries(messages).sort(
    ([, a], [, b]) => a.timestamp - b.timestamp
  );

  entries.forEach(([id, message]) => {
    messagesContainer.appendChild(createMessageElement(id, message));
  });
}

function updateReaction(id, field) {
  const fieldRef = ref(db, `messages/${id}/${field}`);
  runTransaction(fieldRef, (currentValue) => {
    return (currentValue || 0) + 1;
  }).catch((error) => {
    updateStatus(`Unable to update ${field}: ${error.message}`, true);
  });
}

function listenForMessages() {
  onValue(messagesRef, renderMessages, (error) => {
    updateStatus(`Error reading database: ${error.message}`, true);
  });
}

async function publishMessage(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const text = messageInput.value.trim();

  if (!name || !text) {
    updateStatus('Please enter both name and message.', true);
    return;
  }

  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    name,
    text,
    timestamp: Date.now(),
    likes: 0,
    dislikes: 0,
  });

  nameInput.value = '';
  messageInput.value = '';
  updateStatus('Message published successfully!');
}

async function deleteAllMessages() {
  try {
    await remove(messagesRef);
    updateStatus('All messages were deleted successfully.');
  } catch (error) {
    updateStatus(`Unable to delete messages: ${error.message}`, true);
  }
}

listenForMessages();

form.addEventListener('submit', publishMessage);
deleteAllButton.addEventListener('click', deleteAllMessages);
