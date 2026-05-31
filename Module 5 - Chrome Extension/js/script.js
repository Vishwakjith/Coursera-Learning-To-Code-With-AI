const saveButton = document.getElementById('saveButton');
const categorySelect = document.getElementById('category');
const itemList = document.getElementById('itemList');
const emptyMessage = document.getElementById('emptyMessage');
const status = document.getElementById('status');

const debug = document.getElementById('debug');
const debugTwo = document.getElementById('debug-two');

const STORAGE_KEY = 'shoppingListItems';

function createItemCard(item) {
  const li = document.createElement('li');
  li.className = 'item-card';

  const category = document.createElement('div');
  category.className = 'category';
  category.textContent = item.category;

  const paragraph = document.createElement('p');
  const link = document.createElement('a');
  link.href = item.url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = item.url;

  paragraph.appendChild(link);
  li.appendChild(category);
  li.appendChild(paragraph);

  return li;
}

function renderItems(items) {
  itemList.innerHTML = '';
  if (!items || items.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';
  items.forEach((item) => {
    itemList.appendChild(createItemCard(item));
  });
}

function setStatus(message, success = true) {
  status.textContent = message;
  status.style.color = success ? '#047857' : '#b91c1c';
  setTimeout(() => {
    if (status.textContent === message) {
      status.textContent = '';
    }
  }, 2400);
}

function loadItems() {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const items = result[STORAGE_KEY] || [];
    renderItems(items);
  });
}

async function saveCurrentTab() {
  debug.textContent = '';
  debugTwo.textContent = JSON.stringify(chrome.tabs);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      setStatus('Unable to get the current tab URL.', false);
      return;
    }

    const item = {
      category: categorySelect.value,
      url: tab.url,
      savedAt: new Date().toISOString()
    };

    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const items = result[STORAGE_KEY] || [];
      items.unshift(item);
      chrome.storage.local.set({ [STORAGE_KEY]: items }, () => {
        renderItems(items);
        setStatus('Item saved successfully.');
      });
    });
  } catch (error) {
    setStatus('Error saving item.', false);
    console.error(error);
  }
}

saveButton.addEventListener('click', saveCurrentTab);
window.addEventListener('DOMContentLoaded', loadItems);
