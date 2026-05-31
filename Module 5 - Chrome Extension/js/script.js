const saveButton = document.getElementById('saveButton');
const categorySelect = document.getElementById('category');
const itemList = document.getElementById('itemList');
const emptyMessage = document.getElementById('emptyMessage');
const status = document.getElementById('status');
const previewMessage = document.getElementById('previewMessage');
const previewTitle = document.getElementById('previewTitle');
const previewUrl = document.getElementById('previewUrl');

const STORAGE_KEY = 'shoppingListItems';
const TITLE_LIMIT = 50;
const CATEGORY_ORDER = ['Books', 'Clothes', 'Shoes', 'Electronics', 'Pets', 'Health'];

/**
 * Truncate a text string to a maximum length.
 * Adds an ellipsis if the text is longer than the limit.
 */
function truncateText(text, limit = TITLE_LIMIT) {
  if (!text) {
    return '';
  }

  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

/**
 * Create a saved item card element for the shopping list.
 * Uses the stored item name for the link text to show the page title.
 */
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
  link.textContent = item.name;
  link.title = item.url;

  const actions = document.createElement('div');
  actions.className = 'item-actions';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-button';
  deleteButton.setAttribute('aria-label', `Delete ${item.name}`);
  deleteButton.innerHTML = '<span class="delete-icon">&#xE74D;</span>';
  deleteButton.addEventListener('click', () => deleteItem(item.id));

  paragraph.appendChild(link);
  actions.appendChild(deleteButton);

  li.appendChild(category);
  li.appendChild(paragraph);
  li.appendChild(actions);

  return li;
}

/**
 * Delete a saved item by its unique id, then refresh storage and UI.
 */
function deleteItem(itemId) {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const items = result[STORAGE_KEY] || [];
    const updatedItems = items.filter((item) => item.id !== itemId);
    chrome.storage.local.set({ [STORAGE_KEY]: updatedItems }, () => {
      renderItems(updatedItems);
      setStatus('Item deleted.');
    });
  });
}

/**
 * Render the saved shopping list items inside the popup.
 */
function createCategoryGroup(category, items) {
  const section = document.createElement('section');
  section.className = 'category-group';

  const heading = document.createElement('h3');
  heading.className = 'category-heading';
  heading.textContent = category;

  const list = document.createElement('ul');
  list.className = 'category-list';

  items.forEach((item) => {
    list.appendChild(createItemCard(item));
  });

  section.appendChild(heading);
  section.appendChild(list);
  return section;
}

function renderItems(items) {
  const categoryLists = document.getElementById('categoryLists');
  categoryLists.innerHTML = '';

  if (!items || items.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';
  const groupedItems = CATEGORY_ORDER.reduce((groups, category) => {
    groups[category] = items.filter((item) => item.category === category);
    return groups;
  }, {});

  CATEGORY_ORDER.forEach((category) => {
    const categoryItems = groupedItems[category];
    if (categoryItems && categoryItems.length) {
      categoryLists.appendChild(createCategoryGroup(category, categoryItems));
    }
  });
}

/**
 * Show a temporary feedback message for save or error events.
 */
function setStatus(message, success = true) {
  status.textContent = message;
  status.style.color = success ? '#047857' : '#b91c1c';
  setTimeout(() => {
    if (status.textContent === message) {
      status.textContent = '';
    }
  }, 2400);
}

/**
 * Load saved items from chrome.storage.local and render them.
 */
function loadItems() {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const items = result[STORAGE_KEY] || [];
    renderItems(items);
  });
}

/**
 * Display the current tab preview in the popup.
 */
function showPreview(tab) {
  if (!tab) {
    previewMessage.textContent = 'Unable to preview the current tab.';
    previewTitle.textContent = '';
    previewUrl.textContent = '';
    return;
  }

  previewMessage.textContent = '';
  previewTitle.textContent = truncateText(tab.title || tab.url || 'Untitled item');

  previewUrl.textContent = '';
  if (tab.url) {
    const link = document.createElement('a');
    link.href = tab.url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = tab.url;
    previewUrl.appendChild(link);
  } else {
    previewUrl.textContent = 'No URL available.';
  }
}

/**
 * Query the active browser tab and show its preview.
 */
function loadPreview() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    showPreview(tab);
  });
}

/**
 * Save the current tab preview as a shopping list item.
 */
function saveCurrentTab() {
  if (!categorySelect.value) {
    setStatus('Select a category before saving.', false);
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !tab.url) {
      setStatus('Unable to get the current tab URL.', false);
      return;
    }

    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      category: categorySelect.value,
      url: tab.url,
      name: truncateText(tab.title || tab.url || 'Untitled item'),
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
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[STORAGE_KEY]) {
    renderItems(changes[STORAGE_KEY].newValue || []);
  }
});

saveButton.addEventListener('click', saveCurrentTab);
window.addEventListener('DOMContentLoaded', () => {
  loadPreview();
  loadItems();
});
