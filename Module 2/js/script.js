const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('signupForm');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const successMessage = document.getElementById('successMessage');

const maxLength = 64;
const nameRegex = /^[\p{L} '-]+$/u; // allow any language letters + spaces, apostrophes, hyphens
const emailRegex = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/; // simple domain requirement

function showError(element, message) {
  element.textContent = message;
}

function clearMessages() {
  nameError.textContent = '';
  emailError.textContent = '';
  successMessage.textContent = '';
}

function updateButtonState() {
  const nameValidationError = validateName(nameInput.value);
  const emailValidationError = validateEmail(emailInput.value);

  submitBtn.disabled = Boolean(nameValidationError || emailValidationError);
}

nameInput.addEventListener('input', () => {
  const error = validateName(nameInput.value);
  showError(nameError, error);
  updateButtonState();
});

emailInput.addEventListener('input', () => {
  const error = validateEmail(emailInput.value);
  showError(emailError, error);
  updateButtonState();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearMessages();

  const nameValidationError = validateName(nameInput.value);
  const emailValidationError = validateEmail(emailInput.value);

  if (nameValidationError || emailValidationError) {
    showError(nameError, nameValidationError);
    showError(emailError, emailValidationError);
    updateButtonState();
    return;
  }

  const trans = translations[currentLocale] || translations.en;
  const template = (trans && trans.success) ? trans.success : 'Great news: {name} has successfully subscribed with {email}!';
  successMessage.textContent = template
    .replace('{name}', nameInput.value.trim())
    .replace('{email}', emailInput.value.trim());

  form.reset();
  submitBtn.disabled = true;
});

const languageSelect = document.getElementById('languageSelect');
const headerTitle = document.querySelector('.header-content h1');
const headerSubtitle = document.querySelector('.header-content p');
const nameLabel = document.querySelector('label[for="name"]');
const emailLabel = document.querySelector('label[for="email"]');

let translations = {}; // loaded dictionary for languages
let currentLocale = 'en';

function applyTranslations(locale) {
  const trans = translations[locale] || translations.en;
  if (!trans) return;

  document.documentElement.lang = locale;

  headerTitle.textContent = trans.title;
  headerSubtitle.textContent = trans.subtitle;
  nameLabel.textContent = trans.labelName;
  emailLabel.textContent = trans.labelEmail;

  nameInput.placeholder = trans.placeholderName;
  emailInput.placeholder = trans.placeholderEmail;
  submitBtn.textContent = trans.submit;

  // apply only non-field status messages (we don't override validation messages there)
  successMessage.textContent = '';

  // re-validate and set button state
  updateButtonState();
}

function getValidationMessage(key) {
  const trans = translations[currentLocale] || translations.en;
  return trans && trans.validation ? trans.validation[key] || '' : '';
}

function validateName(value) {
  const trimmed = value.trim();

  if (!trimmed) return getValidationMessage('requiredName') || 'Name is required.';
  if (trimmed.length > maxLength) return getValidationMessage('maxLengthName') || `Name must be at most ${maxLength} characters.`;
  if (!nameRegex.test(trimmed)) return getValidationMessage('invalidName') || 'Name can include letters, spaces, apostrophes, and hyphens only.';
  return '';
}

function validateEmail(value) {
  const trimmed = value.trim();

  if (!trimmed) return getValidationMessage('requiredEmail') || 'Email is required.';
  if (trimmed.length > maxLength) return getValidationMessage('maxLengthEmail') || `Email must be at most ${maxLength} characters.`;
  if (!emailRegex.test(trimmed)) return getValidationMessage('invalidEmail') || 'Enter a valid email address with @ and domain.';

  const [localPart, domain] = trimmed.split('@');
  if (!domain || domain.startsWith('.') || domain.endsWith('.')) {
    return getValidationMessage('domainEmail') || 'Email must include a valid domain part.';
  }
  return '';
}

function activateLocale(locale) {
  currentLocale = locale;
  applyTranslations(locale);
}

function populateLocales(availableLocales) {
  languageSelect.innerHTML = '';
  availableLocales.forEach((locale) => {
    const option = document.createElement('option');
    option.value = locale;
    option.textContent = locale.toUpperCase();
    languageSelect.append(option);
  });

  languageSelect.value = currentLocale;
}

languageSelect.addEventListener('change', () => {
  activateLocale(languageSelect.value);
});

function loadTranslations() {
  const availableLocales = ['en', 'es', 'no'];
  const loadPromises = availableLocales.map((locale) =>
    fetch(`i18n/${locale}.json`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${locale}.json`);
      return r.json();
    }).then((data) => {
      translations[locale] = data;
      return locale;
    }).catch(() => null)
  );

  Promise.all(loadPromises).then((loaded) => {
    const locales = loaded.filter((x) => x);
    if (locales.length > 0) {
      currentLocale = locales.includes('en') ? 'en' : locales[0];
      populateLocales(locales);
      applyTranslations(currentLocale);
    } else {
      populateLocales(['en']);
    }
  });
}

// initialize button state on load
updateButtonState();
loadTranslations();