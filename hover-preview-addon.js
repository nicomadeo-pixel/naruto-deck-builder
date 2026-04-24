/* ═══════════════════════════════════════════════════════════════════════════
   Naruto Mythos TCG – Deck Builder | app.js
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

// ── Constants ────────────────────────────────────────────────────────────────
const MAX_CHAR_DECK   = 30;
const MAX_MISSIONS    = 3;
const MAX_COPIES      = 2;   // per card number
const STORAGE_KEY     = 'naruto_tcg_decks';

// ── State ────────────────────────────────────────────────────────────────────
let deck = {
  name: 'My Deck',
  characters: [],   // [{ card, qty }]
  missions:   []    // [{ card, qty }]  — each mission is always qty 1
};

let filters = {
  name:       '',
  type:       '',
  faction:    '',
  rarity:     '',
  chakraMin:  '',
  chakraMax:  '',
  powerMin:   '',
  powerMax:   '',
  keyword:    ''
};

let sortBy  = 'number';
let sortDir = 'asc';
let selectedCard = null;

// ── DOM refs ─────────────────────────────────────────────────────────────────
const $  = id => document.getElementById(id);

const cardGrid        = $('card-grid');
const resultsCount    = $('results-count');
const deckMissions    = $('deck-missions');
const deckCharacters  = $('deck-characters');
const deckNameInput   = $('deck-name');
const statTotal       = $('stat-total');
const statWarn        = $('stat-warn');
const missionCount    = $('mission-count');
const characterCount  = $('character-count');

// filter inputs
const filterName      = $('filter-name');
const filterType      = $('filter-type');
const filterFaction   = $('filter-faction');
const filterRarity    = $('filter-rarity');
const filterChakraMin = $('filter-chakra-min');
const filterChakraMax = $('filter-chakra-max');
const filterPowerMin  = $('filter-power-min');
const filterPowerMax  = $('filter-power-max');
const filterKeyword   = $('filter-keyword');
const sortByEl        = $('sort-by');
const sortDirBtn      = $('sort-dir');

// modals
const modalOverlay    = $('modal-overlay');
const modalClose      = $('modal-close');
const modalImg        = $('modal-img');
const modalRarity     = $('modal-rarity');
const modalName       = $('modal-name');
const modalVersion    = $('modal-version');
const modalStats      = $('modal-stats');
const modalTags       = $('modal-tags');
const modalEffect     = $('modal-effect');
const modalAddBtn     = $('modal-add-btn');
const modalCopies     = $('modal-copies');

const deckManagerOverlay = $('deck-manager-overlay');
const deckManagerClose   = $('deck-manager-close');
const savedDecksList     = $('saved-decks-list');
const noDeckMsg          = $('no-decks-msg');

const exportOverlay   = $('export-overlay');
const exportClose     = $('export-close');
const exportTextarea  = $('export-textarea');
const btnCopyExport   = $('btn-copy-export');

const importOverlay   = $('import-overlay');
const importClose     = $('import-close');
const importTextarea  = $('import-textarea');
const btnDoImport     = $('btn-do-import');
const importError     = $('import-error');

const toast           = $('toast');

// ── Helpers ──────────────────────────────────────────────────────────────────
function showToast(msg, duration = 1800) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { toast.hidden = true; }, duration);
}

function factionClass(faction) {
  if (!faction) return '';
  const map = {
    'Leaf Village':  'faction-leaf',
    'Sand Village':  'faction-sand',
    'Sound Village': 'faction-sound',
    'Mist Village':  'faction-mist',
    'Akatsuki':      'faction-akatsuki'
  };
  return map[faction] || '';
}

function copiesInDeck(number) {
  const all = [...deck.characters, ...deck.missions];
  return all.filter(e => e.card.number === number).reduce((s,e) => s + e.qty, 0);
}

function charTotal() {
  return deck.characters.reduce((s, e) => s + e.qty, 0);
}

// ── Filtering & Sorting ───────────────────────────────────────────────────────
function applyFilters() {
  let list = CARDS.slice();

  if (filters.name) {
    const q = filters.name.toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.version && c.version.toLowerCase().includes(q))
    );
  }

  if (filters.type)    list = list.filter(c => c.type === filters.type);
  if (filters.faction) list = list.filter(c => c.faction === filters.faction);
  if (filters.rarity)  list = list.filter(c => c.rarity === filters.rarity);

  if (filters.chakraMin !== '') list = list.filter(c => c.chakraCost != null && c.chakraCost >= +filters.chakraMin);
  if (filters.chakraMax !== '') list = list.filter(c => c.chakraCost != null && c.chakraCost <= +filters.chakraMax);
  if (filters.powerMin  !== '') list = list.filter(c => c.power != null     && c.power      >= +filters.powerMin);
  if (filters.powerMax  !== '') list = list.filter(c => c.power != null     && c.power      <= +filters.powerMax);

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    list = list.filter(c =>
      c.keywords.some(k => k.toLowerCase().includes(kw))
    );
  }

  // Sort
  list.sort((a, b) => {
    let va = a[sortBy], vb = b[sortBy];
    if (va == null) va = sortDir === 'asc' ? Infinity : -Infinity;
    if (vb == null) vb = sortDir === 'asc' ? Infinity : -Infinity;
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  return list;
}

// ── Render: Card Grid ─────────────────────────────────────────────────────────
function renderGrid() {
  const list = applyFilters();
  resultsCount.textContent = `${list.length} card${list.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    cardGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No cards match your filters.</div>
      </div>`;
    return;
  }

  cardGrid.innerHTML = '';
  list.forEach(card => {
    const copies = copiesInDeck(card.number);
    const inDeck = copies > 0;

    const thumb = document.createElement('div');
    thumb.className = 'card-thumb' + (inDeck ? ' in-deck' : '');
    thumb.dataset.id = card.id;

    const statsHtml = buildThumbStats(card);

    thumb.innerHTML = `
      <div class="card-thumb-img-wrap">
        <img class="card-thumb-img loading" src="${card.image}" alt="${card.name}" loading="lazy" />
        <div class="card-thumb-overlay"></div>
        <span class="rarity-dot ${card.rarity}" title="${rarityLabel(card.rarity)}"></span>
        ${inDeck ? `<span class="in-deck-badge">×${copies}</span>` : ''}
      </div>
      <div class="card-thumb-footer">
        <div class="card-thumb-name">${card.name}</div>
        <div class="card-thumb-version">${card.version || (card.type === 'mission' ? 'Mission' : '')}</div>
        <div class="card-thumb-stats">${statsHtml}</div>
      </div>`;

    // Lazy-load image fade-in
    const img = thumb.querySelector('img');
    img.addEventListener('load',  () => { img.classList.remove('loading'); img.classList.add('loaded'); });
    img.addEventListener('error', () => { img.classList.remove('loading'); img.classList.add('loaded'); });

    thumb.addEventListener('click', () => openModal(card));
    cardGrid.appendChild(thumb);
  });
}

function buildThumbStats(card) {
  let html = '';
  if (card.type === 'character') {
    if (card.chakraCost != null) html += `<span class="stat-pill chakra">⚡${card.chakraCost}</span>`;
    if (card.power      != null) html += `<span class="stat-pill power">⚔${card.power}</span>`;
  } else {
    if (card.missionPoints != null) html += `<span class="stat-pill pts">★${card.missionPoints}</span>`;
  }
  return html;
}

function rarityLabel(r) {
  return { C: 'Common', UC: 'Uncommon', R: 'Rare', M: 'Mythic' }[r] || r;
}

// ── Render: Deck Panel ────────────────────────────────────────────────────────
function renderDeck() {
  const charQty = charTotal();
  const missQty = deck.missions.length;

  // Stats
  statTotal.textContent = `${charQty} / ${MAX_CHAR_DECK} cards`;
  statWarn.hidden = charQty <= MAX_CHAR_DECK;
  missionCount.textContent    = `${missQty} / ${MAX_MISSIONS}`;
  characterCount.textContent  = `${charQty} / ${MAX_CHAR_DECK}`;

  // Missions
  deckMissions.innerHTML = '';
  if (deck.missions.length === 0) {
    deckMissions.innerHTML = `<li class="empty-state" style="padding:0.5rem 0;font-size:0.78rem;">No missions added yet</li>`;
  } else {
    deck.missions.forEach(({ card }) => {
      deckMissions.appendChild(buildDeckEntry(card, 1, 'mission'));
    });
  }

  // Characters
  deckCharacters.innerHTML = '';
  if (deck.characters.length === 0) {
    deckCharacters.innerHTML = `<li class="empty-state" style="padding:0.5rem 0;font-size:0.78rem;">No characters added yet</li>`;
  } else {
    // Group and sort: by number, then name
    const sorted = [...deck.characters].sort((a, b) => {
      if (a.card.number !== b.card.number) return a.card.number - b.card.number;
      return a.card.name.localeCompare(b.card.name);
    });
    sorted.forEach(({ card, qty }) => {
      deckCharacters.appendChild(buildDeckEntry(card, qty, 'character'));
    });
  }

  // Refresh grid badges too
  refreshGridBadges();
}

function buildDeckEntry(card, qty, section) {
  const li = document.createElement('li');
  li.className = 'deck-entry ' + factionClass(card.faction);
  li.innerHTML = `
    <span class="deck-entry-qty">×${qty}</span>
    <span class="deck-entry-name" title="${card.name}">${card.name}</span>
    <span class="deck-entry-version" title="${card.version || ''}">${card.version || ''}</span>
    <div class="deck-entry-controls">
      ${section === 'character' ? `<button class="icon-btn add-one" data-id="${card.id}" title="Add one">+</button>` : ''}
      <button class="icon-btn remove icon-remove" data-id="${card.id}" data-section="${section}" title="Remove one">−</button>
    </div>`;

  li.querySelector('.icon-remove').addEventListener('click', e => {
    e.stopPropagation();
    removeFromDeck(card, section);
  });

  if (section === 'character') {
    li.querySelector('.add-one').addEventListener('click', e => {
      e.stopPropagation();
      addToDeck(card);
    });
  }

  li.addEventListener('click', () => openModal(card));
  return li;
}

function refreshGridBadges() {
  const thumbs = cardGrid.querySelectorAll('.card-thumb');
  thumbs.forEach(thumb => {
    const id = thumb.dataset.id;
    const card = CARDS.find(c => c.id === id);
    if (!card) return;
    const copies = copiesInDeck(card.number);
    const badge  = thumb.querySelector('.in-deck-badge');

    if (copies > 0) {
      thumb.classList.add('in-deck');
      if (badge) { badge.textContent = `×${copies}`; }
      else {
        const span = document.createElement('span');
        span.className = 'in-deck-badge';
        span.textContent = `×${copies}`;
        thumb.querySelector('.card-thumb-img-wrap').prepend(span);
      }
    } else {
      thumb.classList.remove('in-deck');
      if (badge) badge.remove();
    }
  });
}

// ── Deck Logic ────────────────────────────────────────────────────────────────
function addToDeck(card) {
  if (card.type === 'mission') {
    if (deck.missions.length >= MAX_MISSIONS) {
      showToast(`❌ Mission sideboard is full (max ${MAX_MISSIONS})`);
      return false;
    }
    if (deck.missions.find(e => e.card.number === card.number)) {
      showToast('❌ This mission is already in your sideboard');
      return false;
    }
    deck.missions.push({ card, qty: 1 });
    showToast(`✔ ${card.name} → Missions`);

  } else {
    const total = copiesInDeck(card.number);
    if (total >= MAX_COPIES) {
      showToast(`❌ Max ${MAX_COPIES} copies per card (by number)`);
      return false;
    }
    if (charTotal() >= MAX_CHAR_DECK) {
      showToast(`❌ Deck is full (max ${MAX_CHAR_DECK} characters)`);
      return false;
    }
    const existing = deck.characters.find(e => e.card.id === card.id);
    if (existing) {
      existing.qty++;
    } else {
      deck.characters.push({ card, qty: 1 });
    }
    showToast(`✔ ${card.name} added`);
  }

  renderDeck();
  updateModalCopies();
  return true;
}

function removeFromDeck(card, section) {
  if (section === 'mission') {
    deck.missions = deck.missions.filter(e => e.card.id !== card.id);
  } else {
    const entry = deck.characters.find(e => e.card.id === card.id);
    if (!entry) return;
    entry.qty--;
    if (entry.qty <= 0) deck.characters = deck.characters.filter(e => e.card.id !== card.id);
  }
  renderDeck();
  updateModalCopies();
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(card) {
  selectedCard = card;

  modalImg.src     = card.image;
  modalImg.alt     = card.name;
  modalName.textContent    = card.name;
  modalVersion.textContent = card.version || (card.type === 'mission' ? 'Mission Card' : '');
  modalRarity.textContent  = rarityLabel(card.rarity);
  modalRarity.className    = `modal-rarity-badge ${card.rarity}`;
  modalEffect.textContent  = card.effect || '—';

  // Stats
  modalStats.innerHTML = '';
  if (card.type === 'character') {
    if (card.chakraCost != null) {
      modalStats.innerHTML += statBlock('Chakra', card.chakraCost, 'chakra');
    }
    if (card.power != null) {
      modalStats.innerHTML += statBlock('Power', card.power, 'power');
    }
    if (card.faction) {
      modalStats.innerHTML += statBlock('Faction', card.faction, '');
    }
  } else {
    if (card.missionPoints != null) {
      modalStats.innerHTML += statBlock('Points', card.missionPoints, 'pts');
    }
  }

  // Tags
  modalTags.innerHTML = card.keywords.map(k => `<span class="tag-chip">${k}</span>`).join('');

  updateModalCopies();
  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function statBlock(label, value, cls) {
  return `<div class="modal-stat">
    <span class="modal-stat-label">${label}</span>
    <span class="modal-stat-value ${cls}">${value}</span>
  </div>`;
}

function updateModalCopies() {
  if (!selectedCard) return;
  const copies = copiesInDeck(selectedCard.number);

  if (selectedCard.type === 'mission') {
    const already = deck.missions.find(e => e.card.number === selectedCard.number);
    modalAddBtn.disabled     = already || deck.missions.length >= MAX_MISSIONS;
    modalAddBtn.textContent  = already ? '✔ In Missions' : '+ Add to Missions';
    modalCopies.textContent  = already ? 'Already in sideboard' : `${deck.missions.length}/${MAX_MISSIONS} missions`;
  } else {
    const full = copies >= MAX_COPIES || charTotal() >= MAX_CHAR_DECK;
    modalAddBtn.disabled     = full;
    modalAddBtn.textContent  = copies > 0 ? `+ Add (×${copies} in deck)` : '+ Add to Deck';
    modalCopies.textContent  = `${copies}/${MAX_COPIES} copies · ${charTotal()}/${MAX_CHAR_DECK} total`;
  }
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
  selectedCard = null;
}

// ── Deck I/O ──────────────────────────────────────────────────────────────────
function getSavedDecks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveDeck() {
  const name = deckNameInput.value.trim() || 'My Deck';
  deck.name = name;
  const decks = getSavedDecks();
  decks[name] = {
    name,
    characters: deck.characters.map(e => ({ id: e.card.id, qty: e.qty })),
    missions:   deck.missions.map(e => ({ id: e.card.id }))
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  showToast(`💾 "${name}" saved!`);
}

function loadDeckByName(name) {
  const decks = getSavedDecks();
  const saved = decks[name];
  if (!saved) return;

  deck.name       = saved.name;
  deckNameInput.value = saved.name;

  deck.characters = saved.characters.map(entry => {
    const card = CARDS.find(c => c.id === entry.id);
    return card ? { card, qty: entry.qty } : null;
  }).filter(Boolean);

  deck.missions = saved.missions.map(entry => {
    const card = CARDS.find(c => c.id === entry.id);
    return card ? { card, qty: 1 } : null;
  }).filter(Boolean);

  renderDeck();
  renderGrid();
  closeDeckManager();
  showToast(`📂 "${name}" loaded`);
}

function deleteDeckByName(name) {
  const decks = getSavedDecks();
  delete decks[name];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  renderDeckManager();
  showToast(`🗑 "${name}" deleted`);
}

function newDeck() {
  deck = { name: 'My Deck', characters: [], missions: [] };
  deckNameInput.value = 'My Deck';
  renderDeck();
  renderGrid();
  showToast('✨ New deck started');
}

function clearDeck() {
  deck.characters = [];
  deck.missions   = [];
  renderDeck();
  renderGrid();
  showToast('🗑 Deck cleared');
}

// ── Deck Manager modal ────────────────────────────────────────────────────────
function openDeckManager() {
  renderDeckManager();
  deckManagerOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeDeckManager() {
  deckManagerOverlay.hidden = true;
  document.body.style.overflow = '';
}

function renderDeckManager() {
  const decks = getSavedDecks();
  const names = Object.keys(decks);
  savedDecksList.innerHTML = '';
  noDeckMsg.hidden = names.length > 0;

  names.forEach(name => {
    const d   = decks[name];
    const qty = (d.characters || []).reduce((s, e) => s + e.qty, 0);
    const li  = document.createElement('li');
    li.className = 'saved-deck-entry';
    li.innerHTML = `
      <span class="saved-deck-name">${name}</span>
      <span class="saved-deck-meta">${qty} chars · ${(d.missions||[]).length} missions</span>
      <button class="btn btn-primary btn-sm load-btn" data-name="${name}">Load</button>
      <button class="btn btn-danger btn-sm del-btn"  data-name="${name}">Delete</button>`;

    li.querySelector('.load-btn').addEventListener('click', () => loadDeckByName(name));
    li.querySelector('.del-btn').addEventListener('click',  () => {
      if (confirm(`Delete deck "${name}"?`)) deleteDeckByName(name);
    });
    savedDecksList.appendChild(li);
  });
}

// ── Export / Import ───────────────────────────────────────────────────────────
function buildExportText() {
  let txt = `### ${deck.name}\n`;
  txt += `## Missions (${deck.missions.length}/${MAX_MISSIONS})\n`;
  deck.missions.forEach(e => {
    txt += `1x ${e.card.name} [#${e.card.number}]\n`;
  });
  txt += `\n## Characters (${charTotal()}/${MAX_CHAR_DECK})\n`;
  const sorted = [...deck.characters].sort((a,b) => a.card.number - b.card.number);
  sorted.forEach(e => {
    txt += `${e.qty}x ${e.card.name} - ${e.card.version} [#${e.card.number}] (${e.card.rarity})\n`;
  });
  return txt;
}

function openExport() {
  exportTextarea.value = buildExportText();
  exportOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeExport() {
  exportOverlay.hidden = true;
  document.body.style.overflow = '';
}

function openImport() {
  importTextarea.value = '';
  importError.hidden = true;
  importOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeImport() {
  importOverlay.hidden = true;
  document.body.style.overflow = '';
}

function doImport() {
  const lines = importTextarea.value.split('\n').map(l => l.trim()).filter(Boolean);
  const newChars    = [];
  const newMissions = [];
  let deckName      = 'Imported Deck';
  let errors        = [];

  for (const line of lines) {
    // deck name
    if (line.startsWith('###')) { deckName = line.replace(/^###\s*/, ''); continue; }
    // section headers
    if (line.startsWith('##'))  { continue; }
    // blank
    if (!line) continue;

    // parse: "2x Card Name - Version [#107] (R)"  or "1x Card Name [#M1]"
    const m = line.match(/^(\d+)x\s+.+\[#([^\]]+)\]/);
    if (!m) { errors.push(`Unrecognised line: ${line}`); continue; }

    const qty    = parseInt(m[1], 10);
    const numStr = m[2];
    // find card by number (take first match for that number + qty)
    const num = isNaN(+numStr) ? numStr : +numStr;
    const card = CARDS.find(c => String(c.number) === String(num));
    if (!card) { errors.push(`Card #${num} not found`); continue; }

    if (card.type === 'mission') {
      newMissions.push({ card, qty: 1 });
    } else {
      const existing = newChars.find(e => e.card.id === card.id);
      if (existing) existing.qty += qty;
      else newChars.push({ card, qty });
    }
  }

  // validate
  const totalChars = newChars.reduce((s,e) => s + e.qty, 0);
  if (totalChars > MAX_CHAR_DECK) errors.push(`Character count (${totalChars}) exceeds max (${MAX_CHAR_DECK})`);
  if (newMissions.length > MAX_MISSIONS)  errors.push(`Too many missions (${newMissions.length}/${MAX_MISSIONS})`);

  if (errors.length) {
    importError.textContent = errors.join(' | ');
    importError.hidden = false;
    return;
  }

  deck.name       = deckName;
  deck.characters = newChars;
  deck.missions   = newMissions;
  deckNameInput.value = deckName;

  renderDeck();
  renderGrid();
  closeImport();
  showToast(`📥 "${deckName}" imported`);
}

// ── Event wiring ──────────────────────────────────────────────────────────────
filterName.addEventListener('input',   e => { filters.name      = e.target.value; renderGrid(); });
filterType.addEventListener('change',  e => { filters.type      = e.target.value; renderGrid(); });
filterFaction.addEventListener('change',e=>{ filters.faction   = e.target.value; renderGrid(); });
filterRarity.addEventListener('change',e => { filters.rarity    = e.target.value; renderGrid(); });
filterChakraMin.addEventListener('input',e=>{ filters.chakraMin = e.target.value; renderGrid(); });
filterChakraMax.addEventListener('input',e=>{ filters.chakraMax = e.target.value; renderGrid(); });
filterPowerMin.addEventListener('input', e=>{ filters.powerMin  = e.target.value; renderGrid(); });
filterPowerMax.addEventListener('input', e=>{ filters.powerMax  = e.target.value; renderGrid(); });
filterKeyword.addEventListener('input',  e=>{ filters.keyword   = e.target.value; renderGrid(); });

sortByEl.addEventListener('change', e => { sortBy = e.target.value; renderGrid(); });
sortDirBtn.addEventListener('click', () => {
  sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  sortDirBtn.textContent = sortDir === 'asc' ? '↑' : '↓';
  renderGrid();
});

$('btn-clear-filters').addEventListener('click', () => {
  filters = { name:'', type:'', faction:'', rarity:'', chakraMin:'', chakraMax:'', powerMin:'', powerMax:'', keyword:'' };
  filterName.value      = '';
  filterType.value      = '';
  filterFaction.value   = '';
  filterRarity.value    = '';
  filterChakraMin.value = '';
  filterChakraMax.value = '';
  filterPowerMin.value  = '';
  filterPowerMax.value  = '';
  filterKeyword.value   = '';
  renderGrid();
});

$('btn-new-deck').addEventListener('click', newDeck);
$('btn-save-deck').addEventListener('click', saveDeck);
$('btn-load-deck').addEventListener('click', openDeckManager);
$('btn-clear-deck').addEventListener('click', () => { if (confirm('Clear all cards from the deck?')) clearDeck(); });
$('btn-export').addEventListener('click', openExport);
$('btn-import').addEventListener('click', openImport);

// Modal: card detail
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
modalAddBtn.addEventListener('click', () => { if (selectedCard) addToDeck(selectedCard); });

// Modal: deck manager
deckManagerClose.addEventListener('click', closeDeckManager);
deckManagerOverlay.addEventListener('click', e => { if (e.target === deckManagerOverlay) closeDeckManager(); });

// Modal: export
exportClose.addEventListener('click', closeExport);
exportOverlay.addEventListener('click', e => { if (e.target === exportOverlay) closeExport(); });
btnCopyExport.addEventListener('click', () => {
  navigator.clipboard.writeText(exportTextarea.value)
    .then(() => showToast('📋 Copied to clipboard!'))
    .catch(() => { exportTextarea.select(); document.execCommand('copy'); showToast('📋 Copied!'); });
});

// Modal: import
importClose.addEventListener('click', closeImport);
importOverlay.addEventListener('click', e => { if (e.target === importOverlay) closeImport(); });
btnDoImport.addEventListener('click', doImport);

// Keyboard: Escape closes modals
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!modalOverlay.hidden)        closeModal();
  if (!deckManagerOverlay.hidden)  closeDeckManager();
  if (!exportOverlay.hidden)       closeExport();
  if (!importOverlay.hidden)       closeImport();
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderGrid();
renderDeck();
