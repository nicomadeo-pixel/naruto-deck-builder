/* ═══════════════════════════════════════════════════════════════════════════
   Naruto Mythos TCG – Deck Builder | Dark Ninja Theme
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Reset & base ─────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg-base:       #0d0d0f;
  --bg-panel:      #13131a;
  --bg-card:       #1a1a26;
  --bg-card-hover: #22223a;
  --bg-input:      #1e1e2e;
  --border:        #2a2a40;
  --border-focus:  #e07b00;

  --orange:        #e07b00;
  --orange-light:  #f5a623;
  --orange-glow:   rgba(224,123,0,0.25);

  --text-primary:  #f0ece4;
  --text-muted:    #7a7a9a;
  --text-dim:      #4a4a6a;

  --rarity-c:      #9ca3af;
  --rarity-uc:     #60a5fa;
  --rarity-r:      #c084fc;
  --rarity-m:      #fbbf24;

  --red:           #e05555;
  --green:         #4ade80;

  --radius-sm:     6px;
  --radius-md:     10px;
  --radius-lg:     16px;

  --shadow-card:   0 2px 12px rgba(0,0,0,0.6);
  --shadow-glow:   0 0 18px var(--orange-glow);
  --transition:    0.18s ease;
}

html { font-size: 15px; }

body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Segoe UI', system-ui, sans-serif;
  line-height: 1.5;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Scrollbar ────────────────────────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* ── Header ───────────────────────────────────────────────────────────────── */
.site-header {
  background: linear-gradient(135deg, #0a0a10 0%, #1a0a00 100%);
  border-bottom: 2px solid var(--orange);
  box-shadow: 0 2px 24px rgba(224,123,0,0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.logo-leaf { font-size: 1.4rem; }

.logo-title {
  font-size: 1.3rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--orange-light), #fff 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.logo-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* ── Buttons ──────────────────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1.1rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  text-decoration: none;
}

.btn-primary {
  background: var(--orange);
  color: #000;
  border-color: var(--orange);
}
.btn-primary:hover { background: var(--orange-light); border-color: var(--orange-light); }

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border);
}
.btn-secondary:hover { border-color: var(--orange); color: var(--orange); }

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border-color: var(--border);
}
.btn-ghost:hover { color: var(--text-primary); border-color: var(--text-muted); }

.btn-danger {
  background: transparent;
  color: var(--red);
  border-color: var(--red);
}
.btn-danger:hover { background: var(--red); color: #fff; }

.btn-sm { padding: 0.3rem 0.7rem; font-size: 0.8rem; }

/* ── Main Layout ──────────────────────────────────────────────────────────── */
.app-layout {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem 1.5rem 2rem;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.25rem;
  align-items: start;
}

@media (max-width: 960px) {
  .app-layout { grid-template-columns: 1fr; }
  .panel-deck { position: static; }
}

/* ── Filters ──────────────────────────────────────────────────────────────── */
.panel-collection {
  min-width: 0;
}

.filters-bar {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.filter-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-input,
.filter-select {
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  transition: var(--transition);
}

.filter-input:focus,
.filter-select:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 2px var(--orange-glow);
}

.filter-input { flex: 1; min-width: 150px; }
.filter-keyword { min-width: 130px; flex: 0.6; }
.filter-select { min-width: 130px; }
.filter-select option { background: var(--bg-input); }

.range-filter {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.filter-range {
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.5rem;
  font-size: 0.85rem;
  width: 54px;
  outline: none;
}
.filter-range:focus { border-color: var(--border-focus); }

/* ── Sort bar ─────────────────────────────────────────────────────────────── */
.sort-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.results-count {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.filter-select-sm {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  min-width: 110px;
}

.sort-dir-btn {
  padding: 0.3rem 0.55rem;
  font-size: 0.9rem;
  line-height: 1;
}

/* ── Card Grid ────────────────────────────────────────────────────────────── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.card-thumb {
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
  position: relative;
  display: flex;
  flex-direction: column;
}

.card-thumb:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: var(--orange);
  box-shadow: var(--shadow-glow);
  z-index: 2;
}

.card-thumb.in-deck {
  border-color: var(--orange);
}

.card-thumb-img-wrap {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: var(--bg-base);
}

.card-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.3s;
}

.card-thumb-img.loading { opacity: 0; }
.card-thumb-img.loaded  { opacity: 1; }

.card-thumb-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%);
  pointer-events: none;
}

.card-thumb-footer {
  padding: 0.4rem 0.5rem 0.45rem;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
}

.card-thumb-name {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-thumb-version {
  font-size: 0.63rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-thumb-stats {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.stat-pill {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  background: var(--bg-base);
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.stat-pill.chakra { color: #60a5fa; border-color: #1a3a5c; }
.stat-pill.power  { color: #f97316; border-color: #3a1a00; }
.stat-pill.pts    { color: var(--rarity-m); border-color: #3a2a00; }

.rarity-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.3);
  z-index: 1;
}
.rarity-dot.C  { background: var(--rarity-c); }
.rarity-dot.UC { background: var(--rarity-uc); }
.rarity-dot.R  { background: var(--rarity-r); }
.rarity-dot.M  { background: var(--rarity-m); }

.in-deck-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  background: var(--orange);
  color: #000;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  z-index: 1;
  line-height: 1.4;
}

/* ── Deck Panel ───────────────────────────────────────────────────────────── */
.panel-deck {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem;
  position: sticky;
  top: 72px;
  max-height: calc(100vh - 90px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.deck-header { display: flex; flex-direction: column; gap: 0.5rem; }

.deck-name-wrap { display: flex; gap: 0.5rem; align-items: center; }

.deck-name-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 700;
  padding: 0.4rem 0.7rem;
  outline: none;
}
.deck-name-input:focus { border-color: var(--border-focus); }

.deck-stats { display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; }

.stat-badge {
  font-size: 0.78rem;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-weight: 600;
}

.stat-badge.stat-warn { color: var(--red); border-color: var(--red); }

.deck-section { display: flex; flex-direction: column; gap: 0.35rem; }

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.35rem;
}

.section-count { color: var(--orange); font-size: 0.78rem; }

.deck-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.deck-entry {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.3rem 0.5rem;
  transition: var(--transition);
}

.deck-entry:hover { border-color: var(--border-focus); }

.deck-entry-qty {
  background: var(--orange);
  color: #000;
  font-size: 0.7rem;
  font-weight: 800;
  min-width: 20px;
  text-align: center;
  border-radius: 3px;
  padding: 0.05rem 0.2rem;
}

.deck-entry-name {
  flex: 1;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deck-entry-version {
  font-size: 0.68rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
}

.deck-entry-controls {
  display: flex;
  gap: 0.2rem;
  margin-left: auto;
  flex-shrink: 0;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  width: 22px;
  height: 22px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  flex-shrink: 0;
}
.icon-btn:hover { border-color: var(--orange); color: var(--orange); }
.icon-btn.remove:hover { border-color: var(--red); color: var(--red); }

.deck-footer { margin-top: auto; }

/* ── Modal overlay ────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
  backdrop-filter: blur(3px);
}

.modal-overlay[hidden] { display: none !important; }

/* ── Card Detail Modal ────────────────────────────────────────────────────── */
.modal-card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  max-width: 700px;
  width: 100%;
  position: relative;
  box-shadow: 0 8px 60px rgba(0,0,0,0.8);
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  z-index: 10;
}
.modal-close:hover { color: var(--text-primary); border-color: var(--orange); }

.modal-body {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 0;
}

@media (max-width: 540px) {
  .modal-body { grid-template-columns: 1fr; }
  .modal-image-wrap { aspect-ratio: 2/3; max-height: 260px; }
}

.modal-image-wrap {
  background: var(--bg-base);
  display: flex;
  align-items: stretch;
}

.modal-img {
  width: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

@media (max-width: 540px) {
  .modal-img { border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
}

.modal-info {
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow-y: auto;
  max-height: 80vh;
}

.modal-rarity-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  display: inline-block;
  width: fit-content;
}
.modal-rarity-badge.C  { background: rgba(156,163,175,0.15); color: var(--rarity-c); }
.modal-rarity-badge.UC { background: rgba(96,165,250,0.15);  color: var(--rarity-uc); }
.modal-rarity-badge.R  { background: rgba(192,132,252,0.15); color: var(--rarity-r); }
.modal-rarity-badge.M  { background: rgba(251,191,36,0.15);  color: var(--rarity-m); }

.modal-name {
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--text-primary);
}

.modal-version {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
}

.modal-stats {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.modal-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.7rem;
  min-width: 58px;
}

.modal-stat-label {
  font-size: 0.62rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.modal-stat-value {
  font-size: 1.2rem;
  font-weight: 800;
}

.modal-stat-value.chakra { color: #60a5fa; }
.modal-stat-value.power  { color: var(--orange-light); }
.modal-stat-value.pts    { color: var(--rarity-m); }

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.tag-chip {
  font-size: 0.72rem;
  padding: 0.2rem 0.55rem;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.modal-effect {
  font-size: 0.82rem;
  color: var(--text-primary);
  line-height: 1.6;
  background: var(--bg-card);
  border-left: 3px solid var(--orange);
  padding: 0.6rem 0.8rem;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: auto;
  padding-top: 0.4rem;
}

.modal-copies {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* ── Generic Panel Modal ──────────────────────────────────────────────────── */
.modal-panel {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  max-width: 520px;
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 8px 60px rgba(0,0,0,0.8);
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-panel-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
}

/* ── Saved Decks List ─────────────────────────────────────────────────────── */
.saved-decks-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.saved-deck-entry {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.6rem 0.75rem;
  transition: var(--transition);
}

.saved-deck-entry:hover { border-color: var(--orange); }

.saved-deck-name {
  flex: 1;
  font-weight: 700;
  font-size: 0.9rem;
}

.saved-deck-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.no-decks-msg { color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem 0; }

/* ── Export / Import ──────────────────────────────────────────────────────── */
.export-textarea {
  width: 100%;
  height: 240px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  padding: 0.75rem;
  resize: vertical;
  outline: none;
}
.export-textarea:focus { border-color: var(--border-focus); }

.import-hint { font-size: 0.83rem; color: var(--text-muted); }

.import-error {
  color: var(--red);
  font-size: 0.83rem;
  background: rgba(224,85,85,0.1);
  border: 1px solid var(--red);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
}

/* ── Toast ────────────────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--orange);
  color: var(--text-primary);
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 600;
  z-index: 300;
  box-shadow: var(--shadow-glow);
  pointer-events: none;
  animation: fadeInUp 0.2s ease;
}

.toast[hidden] { display: none; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateX(-50%) translateY(12px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* ── Empty state ──────────────────────────────────────────────────────────── */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-dim);
}

.empty-state-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.empty-state-text { font-size: 0.9rem; }

/* ── Faction colours on deck entries ─────────────────────────────────────── */
.faction-leaf  { border-left: 3px solid #4ade80 !important; }
.faction-sand  { border-left: 3px solid #fbbf24 !important; }
.faction-sound { border-left: 3px solid #c084fc !important; }
.faction-mist  { border-left: 3px solid #60a5fa !important; }
.faction-akatsuki { border-left: 3px solid #f87171 !important; }
