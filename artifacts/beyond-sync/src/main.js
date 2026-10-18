// Beyond Sync is a small, self-contained catalog demo. The records below are fictional.
const tracks = [
  {
    id: "01", title: "Soft Signal", artist: "Mira Sen", origin: "Kolkata, India", language: "Bengali · instrumental",
    mood: "Warm", type: "Indie electronic", duration: "3:18", bpm: "94 BPM", year: "2024",
    description: "A close, patient pulse with a little light at the edges. Built around a hand-played keys motif and soft synth textures.",
    master: "One master owner · Mira Sen", publishing: "100% controlled · Mira Sen", vocals: "Instrumental",
    placements: "Film, series, branded content", cover: "cover-a", rights: "One-stop clearance"
  },
  {
    id: "02", title: "A Room in June", artist: "Aarav & The Hours", origin: "Mumbai, India", language: "Hindi · English",
    mood: "Hopeful", type: "Alternative pop", duration: "3:46", bpm: "108 BPM", year: "2023",
    description: "An unhurried guitar song that grows into a bright, full-band refrain. Intimate without losing its horizon.",
    master: "Band-owned master", publishing: "100% controlled · band members", vocals: "Hindi and English",
    placements: "Film, series, trailers", cover: "cover-b", rights: "One-stop clearance"
  },
  {
    id: "03", title: "Blue Hour, Again", artist: "Nila D'Souza", origin: "Goa, India", language: "Konkani · English",
    mood: "Reflective", type: "Dream pop", duration: "4:02", bpm: "82 BPM", year: "2024",
    description: "A floating vocal line over a gauzy guitar and a low, steady drum. A song for the part after the goodbye.",
    master: "Artist-owned master", publishing: "Artist and co-writer share · 50/50", vocals: "Konkani and English",
    placements: "Film, series, documentary", cover: "cover-c", rights: "Publisher confirmation needed"
  },
  {
    id: "04", title: "Paper Kites", artist: "Rohan Iqbal", origin: "Dhaka, Bangladesh", language: "Bengali",
    mood: "Hopeful", type: "Acoustic", duration: "2:57", bpm: "116 BPM", year: "2022",
    description: "A nimble acoustic sketch with an easy lift. The small details stay close while the melody opens out.",
    master: "Artist-owned master", publishing: "100% controlled · Rohan Iqbal", vocals: "Bengali",
    placements: "Film, digital, branded content", cover: "cover-d", rights: "One-stop clearance"
  },
  {
    id: "05", title: "Between Stations", artist: "Tara & Kavi", origin: "London, UK / Chennai, India", language: "Tamil · English",
    mood: "Restless", type: "Indie electronic", duration: "3:31", bpm: "121 BPM", year: "2024",
    description: "A little motion, then a held breath. Warm bass, clipped percussion, and two voices trading the same thought.",
    master: "Artist-owned master", publishing: "100% controlled · Tara & Kavi", vocals: "Tamil and English",
    placements: "Series, trailers, games", cover: "cover-e", rights: "One-stop clearance"
  },
  {
    id: "06", title: "The Long Way Home", artist: "Anika Bose", origin: "Toronto, Canada / Kolkata, India", language: "English",
    mood: "Reflective", type: "Acoustic", duration: "3:09", bpm: "76 BPM", year: "2023",
    description: "A voice recorded close to the mic, a spare piano, and a chorus that lands gently instead of loudly.",
    master: "Artist-owned master", publishing: "100% controlled · Anika Bose", vocals: "English",
    placements: "Film, documentary, branded content", cover: "cover-f", rights: "One-stop clearance"
  }
];

// Saved track IDs stay in this browser using localStorage.
const STORAGE_KEY = "beyond-sync-saved";
let savedTracks = readSavedTracks();
let showSavedOnly = false;
let activeDialog = null;
let toastTimer;

const app = document.querySelector("#app");
const glyphHeart = '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/></svg>';

// Render the page shell once. Search and filters only redraw the catalog cards.
function renderPage() {
  app.innerHTML = `
    <div class="page-shell">
      <header class="topbar">
        <a class="brand" href="#top" aria-label="Beyond Sync home">
          <span class="brand-mark" aria-hidden="true">b.</span>
          <span class="brand-name">beyond <span>sync</span></span>
        </a>
        <nav class="nav-links" id="main-nav" aria-label="Main navigation">
          <a href="#catalog">Explore music</a>
          <a href="#how-it-works">How it works</a>
          <a href="#artist-path">For artists</a>
        </nav>
        <div class="nav-actions">
          <button class="saved-nav" id="saved-toggle" type="button" aria-pressed="false">
            ${glyphHeart}<span>Saved</span><span class="saved-count" id="saved-count">0</span>
          </button>
          <a class="nav-cta" href="#supervisor-path">For supervisors <span aria-hidden="true">↗</span></a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Open navigation" aria-expanded="false" type="button">☰</button>
        </div>
      </header>

      <main id="top">
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-copy">
            <div class="eyebrow">Independent voices. World-ready music.</div>
            <h1 id="hero-title">Find the sound<br>that takes you <em>somewhere.</em></h1>
            <p>A curated home for sync-ready music by independent South Asian artists — with the people and rights behind every track, clearly in view.</p>
            <div class="hero-links">
              <a class="button-light" href="#catalog">Explore the catalog <span aria-hidden="true">↘</span></a>
              <a class="text-link" href="#how-it-works">A clearer way to clear music</a>
            </div>
          </div>
          <div class="hero-art" aria-hidden="true">
            <div class="orbit-label">SOUND, WITH A SENSE OF PLACE</div>
            <div class="art-disc"></div>
            <div class="art-sheet"><span>field notes / 014</span><strong>the<br>in-between</strong><i></i></div>
          </div>
          <div class="hero-note">A living catalog · Curated across borders</div>
        </section>

        <div class="trust-row" id="how-it-works">
          <span class="trust-note">For the person finding the song — and the person who made it.</span>
          <div class="trust-list">
            <span class="trust-item"><b>01</b> Real artist credits</span>
            <span class="trust-item"><b>02</b> Rights, clearly stated</span>
            <span class="trust-item"><b>03</b> Direct human contact</span>
          </div>
        </div>

        <section class="catalog" id="catalog" aria-labelledby="catalog-title">
          <div class="section-head">
            <div>
              <div class="kicker">A first listen, on paper</div>
              <h2 id="catalog-title">Music worth looking closer at.</h2>
            </div>
            <p>Browse by feeling, language, or sound. Every listing includes a plain-language rights snapshot so you know what to ask next.</p>
          </div>
          <div class="filter-panel" role="search" aria-label="Filter the music catalog">
            <label class="search-wrap">
              <span class="sr-only">Search tracks, artists, or places</span>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
              <input type="search" id="search" placeholder="Try an artist, mood, or place" autocomplete="off">
            </label>
            <label><span class="sr-only">Filter by language</span>
              <select id="language-filter"><option value="">Any language</option><option>English</option><option>Bengali</option><option>Hindi</option><option>Konkani</option><option>Tamil</option></select>
            </label>
            <label><span class="sr-only">Filter by mood</span>
              <select id="mood-filter"><option value="">Any mood</option><option>Warm</option><option>Hopeful</option><option>Reflective</option><option>Restless</option></select>
            </label>
            <label><span class="sr-only">Filter by sound</span>
              <select id="type-filter"><option value="">Any sound</option><option>Acoustic</option><option>Alternative pop</option><option>Dream pop</option><option>Indie electronic</option></select>
            </label>
            <button class="clear-filters" id="clear-filters" type="button">Clear filters</button>
          </div>
          <div class="results-line">
            <span id="result-count" aria-live="polite"></span>
            <span>Demo records <strong>· no audio attached</strong></span>
          </div>
          <div class="track-grid" id="track-grid" aria-live="polite"></div>
        </section>

        <section class="pathways" aria-label="Ways to work with Beyond Sync">
          <div class="pathways-intro">
            <div class="kicker">Good work, both ways</div>
            <h2>Make a little room for a new voice.</h2>
            <p>Beyond Sync is built around a simple exchange: artists keep their identity and clarity; music teams find a real person and a straight answer.</p>
          </div>
          <div class="pathway-cards">
            <article class="pathway-card" id="artist-path">
              <span class="path-icon" aria-hidden="true">↗</span>
              <h3>You're an artist?</h3>
              <p>Share your work with music teams looking for something specific, not something generic.</p>
              <button type="button" data-open-form="artist">Tell us about your music <span aria-hidden="true">→</span></button>
            </article>
            <article class="pathway-card" id="supervisor-path">
              <span class="path-icon" aria-hidden="true">⌕</span>
              <h3>Placing music?</h3>
              <p>Tell us what your scene needs. We'll help narrow the search and connect you to the right people.</p>
              <button type="button" data-open-form="supervisor">Start a music brief <span aria-hidden="true">→</span></button>
            </article>
          </div>
        </section>
      </main>

      <footer class="footer">
        <span class="footer-brand">beyond sync</span>
        <span class="footer-note">A demo catalog of fictional sample records. No audio files are provided, so tracks do not play. Rights summaries are examples, not legal advice.</span>
        <span>Made for music with a point of view · 2025</span>
      </footer>
    </div>
    <div id="dialog-root"></div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  `;
  renderTracks();
  updateSavedCount();
  addEventListeners();
}

// Read localStorage safely so the catalog still opens when browser storage is blocked.
function readSavedTracks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Create each catalog card from the record data above.
function cardMarkup(track, index) {
  const isSaved = savedTracks.includes(track.id);
  const visualParts = '<span class="shape-one"></span><span class="shape-two"></span><span class="shape-three"></span>';
  return `
    <article class="track-card">
      <div class="cover ${track.cover}" aria-label="Abstract cover artwork for ${track.title}" role="img">
        <span class="cover-index">FIELD RECORD / ${track.id.padStart(2, "0")}</span>
        <div class="cover-art" aria-hidden="true">${visualParts}</div>
        <button class="save-button ${isSaved ? "is-saved" : ""}" type="button" data-save="${track.id}" aria-label="${isSaved ? "Remove" : "Save"} ${track.title} ${isSaved ? "from" : "to"} saved tracks" aria-pressed="${isSaved}">
          ${glyphHeart}
        </button>
      </div>
      <div class="card-body">
        <div class="tag-row">
          <span class="tag">${track.mood}</span>
          <span class="tag">${track.type}</span>
          <span class="tag tag-rights">${track.rights}</span>
        </div>
        <h3 class="track-title">${track.title}<span class="sr-only">.</span></h3>
        <p class="track-artist">${track.artist} <span aria-hidden="true">·</span> ${track.origin}</p>
        <div class="track-meta">
          <span>${track.duration} &nbsp;·&nbsp; ${track.language.split(" · ")[0]}</span>
          <button class="detail-link" type="button" data-details="${track.id}" aria-label="View ${track.title} details">Track details <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </article>`;
}

// Apply search, language, mood, and sound filters to the current catalog.
function renderTracks() {
  const query = document.querySelector("#search").value.trim().toLowerCase();
  const language = document.querySelector("#language-filter").value;
  const mood = document.querySelector("#mood-filter").value;
  const type = document.querySelector("#type-filter").value;
  const visible = tracks.filter((track) => {
    const searchText = [track.title, track.artist, track.origin, track.language, track.mood, track.type, track.description].join(" ").toLowerCase();
    const languageMatch = !language || track.language.toLowerCase().includes(language.toLowerCase());
    return searchText.includes(query) && languageMatch && (!mood || track.mood === mood) &&
      (!type || track.type === type) && (!showSavedOnly || savedTracks.includes(track.id));
  });

  const grid = document.querySelector("#track-grid");
  document.querySelector("#result-count").innerHTML =
    `<strong>${visible.length} ${visible.length === 1 ? "track" : "tracks"}</strong> ${showSavedOnly ? "in your saved list" : "to explore"}`;
  if (!visible.length) {
    grid.innerHTML = `<div class="empty-state"><div><h3>Nothing in this pocket yet.</h3><p>Try a different filter, or clear your search to see the full catalog.</p><button type="button" id="empty-clear">Clear filters</button></div></div>`;
    document.querySelector("#empty-clear").addEventListener("click", clearFilters);
  } else {
    grid.innerHTML = visible.map(cardMarkup).join("");
  }
}

// Keep the save button, count, and saved-only view in sync.
function toggleSaved(id) {
  savedTracks = savedTracks.includes(id)
    ? savedTracks.filter((trackId) => trackId !== id)
    : [...savedTracks, id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTracks));
  } catch {
    showToast("Your browser could not store this save.");
  }
  updateSavedCount();
  renderTracks();
}

function updateSavedCount() {
  const count = document.querySelector("#saved-count");
  if (count) count.textContent = String(savedTracks.length);
  const toggle = document.querySelector("#saved-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(showSavedOnly));
    toggle.classList.toggle("is-active", showSavedOnly);
  }
}

function clearFilters() {
  document.querySelector("#search").value = "";
  document.querySelector("#language-filter").value = "";
  document.querySelector("#mood-filter").value = "";
  document.querySelector("#type-filter").value = "";
  showSavedOnly = false;
  updateSavedCount();
  renderTracks();
}

// Show a focused rights and track-detail panel. Escape and backdrop clicks close it.
function openTrackDetails(track) {
  activeDialog = "details";
  const root = document.querySelector("#dialog-root");
  root.innerHTML = `
    <div class="dialog-backdrop" data-dismiss="true">
      <section class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div class="dialog-top"><div><div class="kicker">${track.origin} · ${track.year}</div><h2 id="dialog-title">${track.title}</h2><p class="dialog-sub">${track.artist} · ${track.language}</p></div><button class="dialog-close" type="button" aria-label="Close details">×</button></div>
        <hr class="dialog-rule">
        <p class="dialog-summary">${track.description}</p>
        <div class="rights-grid">
          <div class="rights-cell"><small>Master recording</small><strong>${track.master}</strong></div>
          <div class="rights-cell"><small>Composition / publishing</small><strong>${track.publishing}</strong></div>
          <div class="rights-cell"><small>Vocals</small><strong>${track.vocals}</strong></div>
          <div class="rights-cell"><small>Good fit for</small><strong>${track.placements}</strong></div>
          <div class="rights-cell"><small>Tempo & duration</small><strong>${track.bpm} · ${track.duration}</strong></div>
          <div class="rights-cell"><small>Clearance note</small><strong>${track.rights}</strong></div>
        </div>
        <div class="rights-status">${track.rights === "One-stop clearance" ? "One-stop contact available" : "Confirm all parties before use"}</div>
        <p class="dialog-footnote">Fictional demo information, not an offer of license. This demo has no audio files; the listing does not play. Reach out to confirm current rights, terms, and availability.</p>
      </section>
    </div>`;
  bindDialogClose();
  root.querySelector(".dialog-close").focus();
}

// Open an on-page contact form for artists or music supervisors.
function openContactForm(kind) {
  activeDialog = kind;
  const isArtist = kind === "artist";
  const root = document.querySelector("#dialog-root");
  root.innerHTML = `
    <div class="dialog-backdrop" data-dismiss="true">
      <section class="dialog-panel form-dialog" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div class="dialog-top"><div><div class="kicker">${isArtist ? "For the artists" : "For the music teams"}</div><h2 id="form-title">${isArtist ? "Bring us your point of view." : "What does the scene need?"}</h2></div><button class="dialog-close" type="button" aria-label="Close form">×</button></div>
        <p class="dialog-sub">${isArtist ? "Tell us a little about you and your music." : "Give us a few details and we'll shape a useful search."}</p>
        <form class="form-fields" id="pathway-form">
          <div class="field"><label for="contact-name">Your name</label><input id="contact-name" name="name" autocomplete="name" required placeholder="Name"></div>
          <div class="field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com"></div>
          ${isArtist
            ? `<div class="field"><label for="artist-location">Where are you based?</label><input id="artist-location" name="location" required placeholder="City, country"></div><div class="field"><label for="artist-note">Tell us about your sound</label><textarea id="artist-note" name="note" required placeholder="What should a music supervisor know about your work?"></textarea></div>`
            : `<div class="field"><label for="brief-format">Project type</label><select id="brief-format" name="project" required><option value="">Choose a format</option><option>Feature film</option><option>Series</option><option>Documentary</option><option>Brand campaign</option><option>Game</option></select></div><div class="field"><label for="brief-note">Describe the moment</label><textarea id="brief-note" name="note" required placeholder="Scene, mood, timing, language, or anything useful"></textarea></div>`}
          <p class="form-hint">This is a front-end demo. Your details are not sent or stored; the form only shows a local confirmation.</p>
          <button class="form-submit" type="submit">${isArtist ? "Share my interest" : "Shape my brief"} <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </div>`;
  bindDialogClose();
  root.querySelector("#contact-name").focus();
  root.querySelector("#pathway-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    const firstName = String(name).trim().split(/\s+/)[0];
    root.querySelector(".dialog-panel").innerHTML = `
      <div class="confirmation"><div class="kicker">A good first step</div><h3>Thanks, ${escapeHtml(firstName)}.</h3><p>${isArtist ? "Your artist introduction is ready. This demo does not send it anywhere, but a real Beyond Sync team would follow up with next steps." : "Your brief is sketched. This demo does not send it anywhere, but a real music team would follow up with a focused shortlist."}</p><button class="form-submit" type="button" id="confirm-close">Back to the catalog</button></div>`;
    root.querySelector("#confirm-close").addEventListener("click", closeDialog);
    root.querySelector("#confirm-close").focus();
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function bindDialogClose() {
  const root = document.querySelector("#dialog-root");
  root.querySelector(".dialog-close").addEventListener("click", closeDialog);
  root.querySelector(".dialog-backdrop").addEventListener("click", (event) => {
    if (event.target.dataset.dismiss) closeDialog();
  });
}

function closeDialog() {
  activeDialog = null;
  document.querySelector("#dialog-root").innerHTML = "";
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

// Register the page's controls in one place so the behavior stays easy to follow.
function addEventListeners() {
  document.querySelector("#search").addEventListener("input", renderTracks);
  document.querySelector("#language-filter").addEventListener("change", renderTracks);
  document.querySelector("#mood-filter").addEventListener("change", renderTracks);
  document.querySelector("#type-filter").addEventListener("change", renderTracks);
  document.querySelector("#clear-filters").addEventListener("click", clearFilters);

  document.querySelector("#track-grid").addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save]");
    const detailsButton = event.target.closest("[data-details]");
    if (saveButton) toggleSaved(saveButton.dataset.save);
    if (detailsButton) openTrackDetails(tracks.find((track) => track.id === detailsButton.dataset.details));
  });
  document.querySelector("#saved-toggle").addEventListener("click", () => {
    showSavedOnly = !showSavedOnly;
    updateSavedCount();
    renderTracks();
    document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" });
  });
  document.querySelectorAll("[data-open-form]").forEach((button) => {
    button.addEventListener("click", () => openContactForm(button.dataset.openForm));
  });
  const menuButton = document.querySelector("#menu-toggle");
  menuButton.addEventListener("click", () => {
    const nav = document.querySelector("#main-nav");
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.textContent = isOpen ? "×" : "☰";
  });
  document.querySelectorAll("#main-nav a").forEach((link) => link.addEventListener("click", () => {
    document.querySelector("#main-nav").classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.textContent = "☰";
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeDialog) closeDialog();
  });
}

renderPage();
