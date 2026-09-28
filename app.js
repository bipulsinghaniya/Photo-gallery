/* ════════════════════════════════════════
   PhotoGallery — app.js
   ════════════════════════════════════════ */

// ── DATA  (uses Picsum for real placeholder images) ──────────────────────────
const photos = [
  { id:1,  title:"Misty Forest",        desc:"Dense fog rolling through ancient pine trees at dawn.",            cat:"nature",   seed:10,  w:800, h:600 },
  { id:2,  title:"Neon Cityscape",      desc:"Rain-soaked streets reflecting a thousand neon signs.",            cat:"city",     seed:20,  w:800, h:1000},
  { id:3,  title:"Aurora Dreams",       desc:"Northern lights painting the Arctic sky in emerald and violet.",  cat:"abstract", seed:30,  w:800, h:600 },
  { id:4,  title:"Golden Hour",         desc:"Sun dipping below rolling wheat fields at harvest time.",         cat:"nature",   seed:40,  w:800, h:500 },
  { id:5,  title:"Street Hustle",       desc:"A busy intersection alive with commuters and street vendors.",    cat:"people",   seed:50,  w:800, h:900 },
  { id:6,  title:"Geometric Dreams",    desc:"Abstract architectural patterns dissolving into colour.",         cat:"abstract", seed:60,  w:800, h:700 },
  { id:7,  title:"Mountain Mirror",     desc:"A glassy lake perfectly reflecting snow-capped peaks.",           cat:"nature",   seed:70,  w:800, h:600 },
  { id:8,  title:"Tokyo Dusk",          desc:"Shibuya crossing bathed in warm twilight glow.",                  cat:"city",     seed:80,  w:800, h:800 },
  { id:9,  title:"Colour Burst",        desc:"Vibrant powders exploding mid-air during a festival.",           cat:"abstract", seed:90,  w:800, h:650 },
  { id:10, title:"Morning Fishermen",   desc:"Silhouettes casting nets on a calm sea under a pastel sky.",     cat:"people",   seed:100, w:800, h:600 },
  { id:11, title:"Desert Dunes",        desc:"Wind-sculpted dunes casting sharp shadows at midday.",           cat:"nature",   seed:110, w:800, h:700 },
  { id:12, title:"Bridge of Light",     desc:"A suspension bridge glowing with thousands of warm bulbs.",      cat:"city",     seed:120, w:800, h:600 },
  { id:13, title:"Ink Drop",            desc:"A single ink drop blooming into fractal patterns in water.",     cat:"abstract", seed:130, w:800, h:800 },
  { id:14, title:"Laughing Together",   desc:"Friends caught mid-laugh during a rooftop picnic.",              cat:"people",   seed:140, w:800, h:550 },
  { id:15, title:"Autumn Path",         desc:"A cobblestone lane disappearing into a canopy of red leaves.",   cat:"nature",   seed:150, w:800, h:750 },
  { id:16, title:"Rainy Window",        desc:"Rain droplets tracing paths down a café window pane.",          cat:"city",     seed:160, w:800, h:600 },
];

// ── STATE ─────────────────────────────────────────────────────────────────────
let liked   = new Set(JSON.parse(localStorage.getItem('pg_liked') || '[]'));
let active  = 'all';
let query   = '';
let lbIndex = -1;
let filtered= [];

// ── ELEMENTS ──────────────────────────────────────────────────────────────────
const gallery     = document.getElementById('gallery');
const lightbox    = document.getElementById('lightbox');
const lbImg       = document.getElementById('lbImg');
const lbTitle     = document.getElementById('lbTitle');
const lbDesc      = document.getElementById('lbDesc');
const lbTag       = document.getElementById('lbTag');
const lbClose     = document.getElementById('lbClose');
const lbPrev      = document.getElementById('lbPrev');
const lbNext      = document.getElementById('lbNext');
const totalCount  = document.getElementById('totalCount');
const likedCount  = document.getElementById('likedCount');
const searchInput = document.getElementById('searchInput');

// ── HELPERS ───────────────────────────────────────────────────────────────────
const imgUrl = p => `https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}`;

function saveLikes() {
  localStorage.setItem('pg_liked', JSON.stringify([...liked]));
  likedCount.textContent = liked.size;
}

function tagClass(cat) { return `tag-${cat}`; }

// ── RENDER ────────────────────────────────────────────────────────────────────
function render() {
  filtered = photos.filter(p => {
    const matchCat  = active === 'all' || p.cat === active;
    const matchQ    = p.title.toLowerCase().includes(query) || p.cat.toLowerCase().includes(query);
    return matchCat && matchQ;
  });

  gallery.innerHTML = '';

  if (!filtered.length) {
    gallery.innerHTML = '<div class="empty">😔 No photos found. Try another search.</div>';
    return;
  }

  filtered.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${idx * 0.06}s`;

    card.innerHTML = `
      <img src="${imgUrl(p)}" alt="${p.title}" loading="lazy"/>
      <div class="card-overlay">
        <div class="card-title">${p.title}</div>
        <span class="card-tag ${tagClass(p.cat)}">${p.cat}</span>
      </div>
      <div class="card-actions">
        <button class="action-btn like-btn ${liked.has(p.id)?'liked':''}" 
                data-id="${p.id}" title="Like">
          ${liked.has(p.id) ? '❤️' : '🤍'}
        </button>
        <button class="action-btn open-btn" data-idx="${idx}" title="View">🔍</button>
      </div>
    `;

    // Like
    card.querySelector('.like-btn').addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(e.currentTarget.dataset.id);
      if (liked.has(id)) { liked.delete(id); } else { liked.add(id); }
      saveLikes();
      render();
    });

    // Open lightbox
    card.addEventListener('click', () => openLightbox(idx));

    gallery.appendChild(card);
  });

  totalCount.textContent = filtered.length;
}

// ── LIGHTBOX ──────────────────────────────────────────────────────────────────
function openLightbox(idx) {
  lbIndex = idx;
  showLbPhoto();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLbPhoto() {
  const p = filtered[lbIndex];
  lbImg.src = imgUrl(p);
  lbImg.alt = p.title;
  lbTitle.textContent = p.title;
  lbDesc.textContent  = p.desc;
  lbTag.textContent   = p.cat;
  lbTag.className     = `lb-tag ${tagClass(p.cat)}`;
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener('click', () => {
  lbIndex = (lbIndex - 1 + filtered.length) % filtered.length;
  showLbPhoto();
});
lbNext.addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % filtered.length;
  showLbPhoto();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   { lbIndex = (lbIndex - 1 + filtered.length) % filtered.length; showLbPhoto(); }
  if (e.key === 'ArrowRight')  { lbIndex = (lbIndex + 1) % filtered.length; showLbPhoto(); }
});

// ── FILTER BUTTONS ────────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    active = btn.dataset.filter;
    render();
  });
});

// ── SEARCH ────────────────────────────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  query = searchInput.value.trim().toLowerCase();
  render();
});

// ── INIT ──────────────────────────────────────────────────────────────────────
likedCount.textContent = liked.size;
render();
