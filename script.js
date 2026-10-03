const words = [
  { word: "tahanan", pronunciation: "ta-ha-nan", meaning: "home; a place of shelter, belonging, or return", category: "everyday", example: "Ang tahanan ay hindi lang lugar, kundi pakiramdam.", related: ["bahay", "pag-uwian"] },
  { word: "ligaya", pronunciation: "li-ga-ya", meaning: "joy; a deep feeling of happiness", category: "emotion", example: "May ligaya sa maliliit na bagay.", related: ["tuwa", "saya"] },
  { word: "gunita", pronunciation: "gu-ni-ta", meaning: "memory; a recollection of the past", category: "emotion", example: "Iniingatan niya ang gunita ng kanilang pagkakaibigan.", related: ["alaala", "nakaraan"] },
  { word: "hiwaga", pronunciation: "hi-wa-ga", meaning: "mystery; something difficult to explain or understand", category: "emotion", example: "May hiwaga ang tahimik na gabi.", related: ["misteryo", "lihim"] },
  { word: "tala", pronunciation: "ta-la", meaning: "star; a bright object seen in the night sky", category: "nature", example: "Maliwanag ang tala sa ibabaw ng bundok.", related: ["bituin", "langit"] },
  { word: "sinag", pronunciation: "si-nag", meaning: "ray; a narrow beam of light", category: "nature", example: "Pumasok ang sinag ng araw sa bintana.", related: ["liwanag", "araw"] },
  { word: "payapa", pronunciation: "pa-ya-pa", meaning: "peaceful; calm and free from disturbance", category: "emotion", example: "Payapa ang umaga pagkatapos ng ulan.", related: ["tahimik", "panatag"] },
  { word: "malasakit", pronunciation: "ma-la-sa-kit", meaning: "compassionate concern for another person or community", category: "values", example: "Ipinakita niya ang malasakit sa mga nangangailangan.", related: ["pagmamalasakit", "paglingap"] },
  { word: "sipag", pronunciation: "si-pag", meaning: "diligence; steady willingness to work", category: "values", example: "Ang sipag ay natututo sa araw-araw na pagsubok.", related: ["tiyaga", "pagsisikap"] },
  { word: "giliw", pronunciation: "gi-liw", meaning: "beloved; a person who is dear to someone", category: "emotion", example: "Giliw, ingatan mo ang sarili mo.", related: ["mahal", "irog"] },
  { word: "dalisay", pronunciation: "da-li-say", meaning: "pure; clear and free from impurity", category: "values", example: "Dalisay ang kanyang hangarin na makatulong.", related: ["wagas", "malinis"] },
  { word: "halina", pronunciation: "ha-li-na", meaning: "come along; an invitation to join", category: "everyday", example: "Halina at sabay tayong maglakad.", related: ["tara", "sumama"] }
];

const FAVORITES_KEY = "salin-favorites";
const wordGrid = document.querySelector("#word-grid");
const savedList = document.querySelector("#saved-list");
const savedEmpty = document.querySelector("#saved-empty");
const resultCount = document.querySelector("#result-count");
const template = document.querySelector("#word-card-template");
const searchInput = document.querySelector("#search-input");

let activeCategory = "all";
let favorites = loadFavorites();

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(word) {
  return favorites.includes(word);
}

function getFilteredWords() {
  const query = searchInput.value.trim().toLowerCase();

  return words.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const searchableText = `${item.word} ${item.meaning} ${item.related.join(" ")}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });
}

function createWordCard(item) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".word-card");
  const saveButton = fragment.querySelector(".save-button");

  card.querySelector(".category").textContent = item.category;
  card.querySelector(".word").textContent = item.word;
  card.querySelector(".pronunciation").textContent = `/${item.pronunciation}/`;
  card.querySelector(".meaning").textContent = item.meaning;
  card.querySelector(".example").textContent = `“${item.example}”`;

  const related = card.querySelector(".related");
  item.related.forEach((word) => {
    const tag = document.createElement("span");
    tag.textContent = word;
    related.appendChild(tag);
  });

  updateSaveButton(saveButton, item.word);
  saveButton.addEventListener("click", () => toggleFavorite(item.word));
  return fragment;
}

function updateSaveButton(button, word) {
  const saved = isFavorite(word);
  button.textContent = saved ? "♥" : "♡";
  button.classList.toggle("is-saved", saved);
  button.setAttribute("aria-label", saved ? `Remove ${word} from saved words` : `Save ${word}`);
}

function renderWords() {
  const filteredWords = getFilteredWords();
  wordGrid.innerHTML = "";
  filteredWords.forEach((item) => wordGrid.appendChild(createWordCard(item)));

  resultCount.textContent = `${filteredWords.length} ${filteredWords.length === 1 ? "word" : "words"}`;
  document.querySelector("#no-results").hidden = filteredWords.length > 0;
}

function renderWordOfDay() {
  const today = new Date();
  const index = (today.getDate() + today.getMonth() * 31) % words.length;
  const item = words[index];
  const card = document.querySelector("#day-card");

  card.innerHTML = `
    <div>
      <p class="word">${item.word}</p>
      <p class="pronunciation">/${item.pronunciation}/</p>
    </div>
    <div>
      <p class="meaning">${item.meaning}</p>
      <p class="example-label">In a sentence</p>
      <p class="example">“${item.example}”</p>
    </div>
  `;
}

function renderFavorites() {
  const savedWords = words.filter((item) => isFavorite(item.word));
  savedList.innerHTML = "";
  savedEmpty.hidden = savedWords.length > 0;

  savedWords.forEach((item) => {
    const article = document.createElement("article");
    article.className = "saved-item";
    article.innerHTML = `
      <div>
        <h3>${item.word}</h3>
        <p>${item.meaning}</p>
      </div>
      <button type="button">Remove</button>
    `;
    article.querySelector("button").addEventListener("click", () => toggleFavorite(item.word));
    savedList.appendChild(article);
  });
}

function toggleFavorite(word) {
  favorites = isFavorite(word)
    ? favorites.filter((item) => item !== word)
    : [...favorites, word];
  saveFavorites();
  renderWords();
  renderFavorites();
}

searchInput.addEventListener("input", renderWords);

document.querySelector("#clear-search").addEventListener("click", () => {
  searchInput.value = "";
  renderWords();
  searchInput.focus();
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderWords();
  });
});

renderWordOfDay();
renderWords();
renderFavorites();
