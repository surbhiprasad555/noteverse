/* ============================================================
   Noteverse — app.js
   All application logic for notes, categories, quotes, UI.
   ============================================================ */

/* ── Theme Toggle ─────────────────────────────────────────── */
const themeToggle = document.getElementById('input');
themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.remove('day-theme');
    } else {
        document.body.classList.add('day-theme');
    }
});

// Initialize theme based on checkbox state
if (!themeToggle.checked) {
    document.body.classList.add('day-theme');
}

// Remove preload class after first render to enable transitions
window.addEventListener('load', () => {
    document.body.classList.remove('preload');
});

/* ── Generate Stars ───────────────────────────────────────── */
const starsContainer = document.getElementById('stars-container');
for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 8 + 4;
    star.classList.add('star', 'star-glow');
    star.style.width    = `${size}px`;
    star.style.height   = `${size}px`;
    star.style.left     = `${Math.random() * 100}vw`;
    star.style.top      = `${Math.random() * 60}vh`;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    starsContainer.appendChild(star);
}

/* ── Generate Birds (Day Theme) ───────────────────────────── */
const birdsContainer = document.getElementById('birds-container');
for (let i = 0; i < 8; i++) {
    const bird = document.createElement('div');
    bird.classList.add('bird');
    bird.style.left = `${Math.random() * 80 + 10}vw`;
    bird.style.top  = `${Math.random() * 40 + 10}vh`;
    bird.innerHTML  = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M2,16 Q6,12 12,16 Q18,12 22,16 Q18,14 12,18 Q6,14 2,16 Z" />
        </svg>`;
    bird.style.animation      = `fly ${Math.random() * 10 + 10}s infinite alternate ease-in-out`;
    bird.style.animationDelay = `-${Math.random() * 10}s`;
    birdsContainer.appendChild(bird);
}

/* ── State ────────────────────────────────────────────────── */
let appNotes = [
    { id: 1, title: 'Note 1', message: 'This is an empty note canvas. A beautiful idea can start here...', status: 'all' },
    { id: 2, title: 'Note 2', message: 'This is an empty note canvas. A beautiful idea can start here...', status: 'all' },
    { id: 3, title: 'Note 3', message: 'This is an empty note canvas. A beautiful idea can start here...', status: 'all' }
];

let currentCategory = '';
let currentIconHTML  = '';

/* ── DOM References ───────────────────────────────────────── */
const categoryOverlay        = document.getElementById('category-overlay');
const mainSidebar            = document.getElementById('main-sidebar');
const addNoteBtn             = document.getElementById('add-note-btn');
const categoryCardsContainer = document.getElementById('category-cards');
const addNoteOverlay         = document.getElementById('add-note-overlay');
const noteDatetime           = document.getElementById('note-datetime');
const mainQuotesEl           = document.getElementById('main-quotes');
const topBarEl               = document.getElementById('top-bar');

/* ── Helpers: show/hide quotes & top bar ─────────────────── */
function hideHomeUI()  {
    mainQuotesEl?.classList.add('hide-ui');
    topBarEl?.classList.add('hide-ui');
}
function showHomeUI()  {
    mainQuotesEl?.classList.remove('hide-ui');
    topBarEl?.classList.remove('hide-ui');
}

/* ── Category Logic ───────────────────────────────────────── */
function openCategory(title, iconHTML) {
    currentCategory = title;
    if (iconHTML) currentIconHTML = iconHTML;

    document.getElementById('category-title').textContent          = currentCategory;
    document.getElementById('category-icon-wrapper').innerHTML     = currentIconHTML;

    renderCategoryCards();

    categoryOverlay.classList.remove('hide-ui');
    mainSidebar.classList.add('hide-ui');
    addNoteBtn.classList.add('hide-ui');
    hideHomeUI();
}

function closeCategory() {
    categoryOverlay.classList.add('hide-ui');
    mainSidebar.classList.remove('hide-ui');
    addNoteBtn.classList.remove('hide-ui');
    showHomeUI();
}

function handleOverlayClick(e) {
    // Close only when clicking the bare overlay background (not cards, inputs, buttons, or header)
    const isInteractive = e.target.closest('.glass-card')
        || e.target.closest('button')
        || e.target.closest('input')
        || e.target.closest('textarea')
        || e.target.closest('label')
        || e.target.closest('#category-header');
    if (!isInteractive) closeCategory();
}

function scrollCarousel(direction) {
    const container = document.getElementById('category-cards');
    const cardWidth  = container.firstElementChild ? container.firstElementChild.offsetWidth : 300;
    const gap        = 40; // matches gap-10 (2.5rem = 40px)
    container.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
}

/* ── Render Cards ─────────────────────────────────────────── */
function renderCategoryCards() {
    let cardsHTML = '';

    if (currentCategory === 'To-do list') {
        for (let j = 0; j < 3; j++) {
            cardsHTML += `
                <div class="glass-card animate-card relative p-10 flex flex-col gap-8 w-[760px] max-w-[90vw] shrink-0 snap-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform duration-300 min-h-[min-content] my-4" style="border-radius:2.5rem;background:rgba(255,255,255,0.2);animation-delay:${j*0.15}s;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);">
                    <input type="text" placeholder="Enter topic/name/title" class="w-full bg-black/50 text-white placeholder-white/80 px-8 py-6 rounded-full outline-none font-sans text-2xl shadow-inner focus:ring-2 focus:ring-white/60 transition-all mb-2">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full pb-4">
                        ${Array.from({length: 6}).map((_, i) => `
                            <div class="flex items-center gap-4 w-full">
                                <label class="relative flex items-center justify-center cursor-pointer shrink-0">
                                    <input type="checkbox" class="peer sr-only" onchange="toggleTask(this)">
                                    <div class="w-12 h-12 rounded-full bg-black/50 shadow-inner peer-checked:bg-white/40 transition-all flex items-center justify-center hover:bg-black/60">
                                        <svg class="w-6 h-6 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </label>
                                <input type="text" placeholder="Task ${i + 1}" class="task-input flex-1 bg-black/50 text-white placeholder-white/80 px-6 py-4 rounded-full outline-none font-sans text-xl shadow-inner focus:ring-2 focus:ring-white/60 transition-all min-w-0">
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        }

    } else if (currentCategory === 'Archive') {
        const archivedNotes = appNotes.filter(n => n.status === 'archived');
        if (archivedNotes.length === 0) {
            cardsHTML = `<p class="text-3xl opacity-60 font-sans">No archived notes.</p>`;
        } else {
            const rotations = ['-rotate-6', 'rotate-0', 'rotate-6'];
            archivedNotes.forEach((note, i) => {
                const rot = rotations[i % 3];
                cardsHTML += `
                    <div class="animate-card shrink-0 snap-center" style="animation-delay:${(i%3)*0.15}s">
                        <div class="glass-card relative p-6 flex flex-col justify-between w-[280px] h-[360px] shadow-xl transition-transform duration-300 transform ${rot} hover:scale-105 hover:z-10" style="border-radius:2rem;background:rgba(255,255,255,0.2);">
                            <div class="flex-1 overflow-hidden">
                                <h3 class="font-bold text-3xl mb-2 opacity-80 truncate text-center">${note.title}</h3>
                                <p class="text-xl opacity-70 text-center leading-relaxed line-clamp-6 font-sans">${note.message}</p>
                            </div>
                            <button class="w-full bg-black/50 text-white/90 py-3 rounded-[2rem] text-4xl hover:bg-black/60 transition-colors shadow-inner mt-4" onclick="restoreNote(${note.id})">Restore</button>
                        </div>
                    </div>`;
            });
        }

    } else if (currentCategory === 'Ideas') {
        for (let i = 0; i < 3; i++) {
            cardsHTML += `
                <div class="animate-card shrink-0 snap-center" style="animation-delay:${i*0.15}s">
                    <div class="glass-card relative p-5 flex flex-col gap-4 w-[320px] h-[440px] shadow-xl transition-transform duration-300 hover:scale-105" style="border-radius:2.5rem;background:rgba(255,255,255,0.25);">
                        <input type="text" placeholder="Topic" class="w-full h-20 bg-white/30 text-white placeholder-white/80 px-6 rounded-3xl outline-none text-4xl shadow-inner focus:ring-2 focus:ring-white/60 transition-all text-center">
                        <textarea placeholder="Enter ideas..." class="w-full flex-1 bg-white/30 text-white placeholder-white/80 px-6 py-6 rounded-3xl outline-none text-3xl shadow-inner focus:ring-2 focus:ring-white/60 transition-all resize-none text-center"></textarea>
                    </div>
                </div>`;
        }

    } else {
        // All notes or Pinned notes
        const targetStatus  = currentCategory === 'Pinned notes' ? 'pinned' : 'all';
        const filteredNotes = appNotes.filter(n => n.status === targetStatus);

        if (filteredNotes.length === 0) {
            cardsHTML = `<p class="text-3xl opacity-60 font-sans">No notes here yet.</p>`;
        } else {
            filteredNotes.forEach((note, i) => {
                const pinBtn = targetStatus === 'all'
                    ? `<button class="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-full font-sans text-xl transition-colors shadow-inner" onclick="pinNote(${note.id})">Pin</button>`
                    : `<button class="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-full font-sans text-xl transition-colors shadow-inner" onclick="unpinNote(${note.id})">Unpin</button>`;

                cardsHTML += `
                    <div class="glass-card flex flex-col animate-card hover:scale-105 shrink-0 snap-center w-[300px] h-[400px] p-6 shadow-xl" style="border-radius:2rem;background:rgba(255,255,255,0.2);animation-delay:${(i%3)*0.15}s">
                        <div class="flex-1 overflow-hidden">
                            <h3 class="font-bold text-4xl mb-4 opacity-90 truncate text-center drop-shadow-md">${note.title}</h3>
                            <p class="font-sans text-xl opacity-80 text-center leading-relaxed line-clamp-[8]">${note.message}</p>
                        </div>
                        <div class="flex gap-4 mt-6">
                            ${pinBtn}
                            <button class="flex-1 bg-red-500/40 hover:bg-red-500/60 text-white py-2 rounded-full font-sans text-xl transition-colors shadow-inner" onclick="archiveNote(${note.id})">Delete</button>
                        </div>
                    </div>`;
            });
        }
    }

    categoryCardsContainer.innerHTML = cardsHTML;
}

/* ── Note CRUD ────────────────────────────────────────────── */
function pinNote(id)     { _setStatus(id, 'pinned');   }
function unpinNote(id)   { _setStatus(id, 'all');      }
function archiveNote(id) { _setStatus(id, 'archived'); }
function restoreNote(id) { _setStatus(id, 'all');      }

function _setStatus(id, status) {
    const note = appNotes.find(n => n.id === id);
    if (note) { note.status = status; renderCategoryCards(); }
}

/* ── To-do Task Toggle ────────────────────────────────────── */
function toggleTask(checkbox) {
    const input = checkbox.closest('.flex').querySelector('.task-input');
    if (input) {
        input.classList.toggle('line-through', checkbox.checked);
        input.classList.toggle('opacity-50',   checkbox.checked);
    }
}

/* ── Add Note Overlay ─────────────────────────────────────── */
function updateDateTime() {
    if (!noteDatetime) return;
    const now     = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    noteDatetime.textContent = now.toLocaleString('en-US', options);
}

function openAddNote() {
    addNoteOverlay.classList.remove('hide-ui');
    updateDateTime();
    mainSidebar.classList.add('hide-ui');
    addNoteBtn.classList.add('hide-ui');
    hideHomeUI();
}

function closeAddNote() {
    addNoteOverlay.classList.add('hide-ui');
    mainSidebar.classList.remove('hide-ui');
    addNoteBtn.classList.remove('hide-ui');
    showHomeUI();
}

function handleAddNoteOverlayClick(e) {
    if (e.target === addNoteOverlay) closeAddNote();
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
        const url        = URL.createObjectURL(files[0]);
        const previewImg = document.getElementById('main-preview-img');
        previewImg.src   = url;
        previewImg.classList.remove('hidden');
    }
}

function saveNote() {
    const title = document.getElementById('note-title').value.trim()   || 'Untitled Note';
    const msg   = document.getElementById('note-message').value.trim() || 'No content...';

    appNotes.unshift({ id: Date.now(), title, message: msg, status: 'all' });

    // Clear form fields
    document.getElementById('note-title').value   = '';
    document.getElementById('note-message').value = '';
    document.getElementById('file-upload').value  = '';
    const previewImg = document.getElementById('main-preview-img');
    previewImg.src   = '';
    previewImg.classList.add('hidden');

    closeAddNote();

    // Show newly saved note immediately
    openCategory('All notes', `<svg viewBox="0 0 24 24" class="icon-svg w-8 h-8 text-black fill-current transition-transform duration-300"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg>`);
}

/* ── Rotating Quotes ──────────────────────────────────────── */
const quotes = [
    { text: "If you want to shine like a sun, first burn like a sun.",                              author: "Dr. A.P.J. Abdul Kalam" },
    { text: "Be the change that you wish to see in the world.",                                     author: "Mahatma Gandhi"         },
    { text: "You can't cross the sea merely by standing and staring at the water.",                 author: "Rabindranath Tagore"    },
    { text: "Arise, awake and stop not till the goal is reached.",                                  author: "Swami Vivekananda"      },
    { text: "I don't believe in taking right decisions. I take decisions and then make them right.", author: "Ratan Tata"             }
];

let currentQuoteIndex = 0;

function updateQuote() {
    const quoteTextEl   = document.getElementById('quote-text');
    const quoteAuthorEl = document.getElementById('quote-author');
    if (!quoteTextEl || !quoteAuthorEl) return;

    quoteTextEl.style.opacity   = '0';
    quoteAuthorEl.style.opacity = '0';

    setTimeout(() => {
        quoteTextEl.textContent   = `"${quotes[currentQuoteIndex].text}"`;
        quoteAuthorEl.textContent = `- ${quotes[currentQuoteIndex].author}`;
        quoteTextEl.style.opacity   = '1';
        quoteAuthorEl.style.opacity = '1';
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    }, 1000);
}

/* ── Typewriter Greeting ──────────────────────────────────── */
const WELCOME_TEXT  = "Hey welcome to Noteverse! Good to see you here, I can't wait to hold your memories and thoughts";
const typewriterEl  = document.getElementById('typewriter-text');
let typeIndex       = 0;

function typeWriter() {
    if (typewriterEl && typeIndex < WELCOME_TEXT.length) {
        typewriterEl.textContent += WELCOME_TEXT.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 50);
    }
}

/* ── Bootstrap ────────────────────────────────────────────── */
updateDateTime();
setInterval(updateDateTime, 1000);

updateQuote();
setInterval(updateQuote, 10000);

setTimeout(typeWriter, 1000);
