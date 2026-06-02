const fs = require('fs');

let content = fs.readFileSync('public/aktualnosci.html', 'utf8');

// Find where <div class="news-list-premium"> starts
const listStartStr = '<div class="news-list-premium">';
const listStartIndex = content.indexOf(listStartStr);

if (listStartIndex === -1) {
    console.log("Could not find news-list-premium");
    process.exit(1);
}

// Find where it ends
const sectionEndStr = '</section>';
const sectionEndIndex = content.indexOf(sectionEndStr, listStartIndex);

const beforeList = content.substring(0, listStartIndex + listStartStr.length);
const afterList = content.substring(sectionEndIndex);

const newCSS = `
<style>
/* Slider CSS */
.featured-slider-container {
    position: relative;
    width: 100%;
    max-width: 1400px;
    height: 460px;
    margin: 0 auto 5rem auto;
    border-radius: 0;
    overflow: hidden;
    background: var(--text-primary);
    box-shadow: none;
}
.featured-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    display: flex;
    align-items: flex-end;
}
.featured-slide.active {
    position: relative;
    opacity: 1;
}
.fs-img-wrapper {
    position: absolute;
    inset: 0;
}
.fs-img-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(10,18,15,0.85) 0%, rgba(10,18,15,0.4) 50%, transparent 100%),
                linear-gradient(0deg, rgba(10,18,15,0.5) 0%, transparent 50%);
    z-index: 2;
}
.fs-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.95) saturate(1.1);
}
.fs-content {
    position: relative;
    z-index: 2;
    padding: 5rem 6rem;
    color: #fff;
    max-width: 800px;
}
.fs-badge {
    background: transparent;
    color: var(--accent-gold);
    padding: 0;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    border-radius: 0;
    margin-bottom: 1.2rem;
    display: inline-block;
}
.fs-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 1rem;
}
.fs-excerpt {
    font-size: 1rem;
    font-weight: 300;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
    margin-bottom: 2rem;
}
.fs-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    color: #fff;
    text-decoration: none;
    font-weight: 400;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.3);
    padding: 0.5rem 0;
    border-radius: 0;
    transition: all 0.4s ease;
}
.fs-btn:hover {
    background: transparent;
    color: var(--accent-gold);
    border-bottom-color: var(--accent-gold);
    gap: 1.2rem;
}
.fs-controls {
    position: absolute;
    bottom: 4rem;
    right: 5rem;
    z-index: 3;
    display: flex;
    gap: 1rem;
}
.fs-control-btn {
    width: 48px;
    height: 48px;
    border-radius: 0;
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;
}
.fs-control-btn:hover {
    background: transparent;
    color: var(--accent-gold);
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .fs-content { padding: 2rem; }
    .fs-title { font-size: 2rem; }
    .fs-controls { display: none; }
}
</style>

<!-- FEATURED SLIDER -->
<div class="featured-slider-container reveal reveal-up" id="featuredSlider">
    <div class="fs-controls">
        <button class="fs-control-btn" id="fsPrev"><i class="fas fa-chevron-left"></i></button>
        <button class="fs-control-btn" id="fsNext"><i class="fas fa-chevron-right"></i></button>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const articles = Array.from(document.querySelectorAll('.news-list-premium .news-list-item-premium'));
    const sliderContainer = document.getElementById('featuredSlider');
    const controls = sliderContainer.querySelector('.fs-controls');
    
    if (articles.length > 0 && sliderContainer) {
        const shuffled = articles.sort(() => 0.5 - Math.random());
        const selectedArticles = shuffled.slice(0, 3);
        
        selectedArticles.forEach((article, index) => {
            const imgEl = article.querySelector('.nlip-img');
            const categoryEl = article.querySelector('.nlip-category');
            const titleEl = article.querySelector('.nlip-title a');
            const excerptEl = article.querySelector('.nlip-excerpt');
            
            if (!imgEl || !titleEl) return;
            
            const imgSrc = imgEl.src;
            const imgAlt = imgEl.alt || 'Artykuł';
            const category = categoryEl ? categoryEl.textContent : 'Wyróżnione';
            const title = titleEl.textContent;
            const link = titleEl.href;
            const excerpt = excerptEl ? excerptEl.textContent.trim() : '';
            
            const slide = document.createElement('div');
            slide.className = 'featured-slide' + (index === 0 ? ' active' : '');
            slide.innerHTML = \`
                <div class="fs-img-wrapper">
                    <img src="\${imgSrc}" alt="\${imgAlt}">
                </div>
                <div class="fs-content">
                    <span class="fs-badge">\${category}</span>
                    <h2 class="fs-title">\${title}</h2>
                    <p class="fs-excerpt">\${excerpt}</p>
                    <a href="\${link}" class="fs-btn">Czytaj dalej <i class="fas fa-arrow-right"></i></a>
                </div>
            \`;
            sliderContainer.insertBefore(slide, controls);
        });
    }

    let slides = document.querySelectorAll('.featured-slide');
    const nextBtn = document.getElementById('fsNext');
    const prevBtn = document.getElementById('fsPrev');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    resetInterval();
});
</script>

<div class="news-list-premium">
`;

// Build 9 standard articles
const item2 = `
    <!-- Item 2: Nagrody -->
    <article class="news-list-item-premium reveal reveal-up delay-100">
        <div class="nlip-img-wrapper">
            <a href="inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html" class="nlip-img-link">
                <img src="https://i.imgur.com/rmV5MvN.jpeg" alt="Nagroda Srebrnego Wilka" class="nlip-img">
            </a>
        </div>
        <div class="nlip-content">
            <div class="nlip-meta">
                <span class="nlip-category">Nagrody</span>
                <span class="nlip-sep"></span>
                <span class="nlip-date">10 Kwi 2026</span>
            </div>
            <h3 class="nlip-title">
                <a href="inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html">Inicjatywa Brodnica Beehouses z Nagrodą Srebrnego Wilka</a>
            </h3>
            <p class="nlip-excerpt">
                Nasz flagowy projekt został doceniony podczas ogólnopolskiej gali. To ogromne wyróżnienie dla całego zespołu i dowód na to, że lokalne działania mają globalny sens.
            </p>
            <div class="nlip-btn-wrapper">
                <a href="inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html" class="nlip-btn">
                    Czytaj dalej <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </article>
`;

const item3 = `
    <!-- Item 3: Edukacja -->
    <article class="news-list-item-premium reveal reveal-up delay-200">
        <div class="nlip-img-wrapper">
            <a href="projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach.html" class="nlip-img-link">
                <img src="https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800" alt="Edukacja o zapylaczach" class="nlip-img">
            </a>
        </div>
        <div class="nlip-content">
            <div class="nlip-meta">
                <span class="nlip-category">Edukacja</span>
                <span class="nlip-sep"></span>
                <span class="nlip-date">02 Kwi 2026</span>
            </div>
            <h3 class="nlip-title">
                <a href="projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach.html">Projekt Brodnica Beehouses 2025 - Edukacja o zapylaczach</a>
            </h3>
            <p class="nlip-excerpt">
                Rozpoczynamy nową edycję warsztatów w szkołach. Poznaj plany rozwoju projektu i dowiedz się, jak dołączyć do naszej inicjatywy ratowania pszczół.
            </p>
            <div class="nlip-btn-wrapper">
                <a href="projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach.html" class="nlip-btn">
                    Czytaj dalej <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </article>
`;

const dummyItem = (id, imgId) => `
    <!-- Item ${id} -->
    <article class="news-list-item-premium reveal reveal-up">
        <div class="nlip-img-wrapper">
            <a href="#" class="nlip-img-link">
                <img src="https://images.unsplash.com/photo-1${500000000000 + imgId}?auto=format&fit=crop&q=80&w=800" alt="Artykuł" class="nlip-img">
            </a>
        </div>
        <div class="nlip-content">
            <div class="nlip-meta">
                <span class="nlip-category">Wydarzenie</span>
                <span class="nlip-sep"></span>
                <span class="nlip-date">Marzec 2026</span>
            </div>
            <h3 class="nlip-title">
                <a href="#">Tytuł przykładowego artykułu #${id}</a>
            </h3>
            <p class="nlip-excerpt">
                Przykładowy opis dla kolejnego wpisu na blogu. Miejsce na ciekawą treść i zachęcenie do przeczytania całego artykułu.
            </p>
            <div class="nlip-btn-wrapper">
                <a href="#" class="nlip-btn">
                    Czytaj dalej <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </article>
`;

let itemsHTML = item2 + item3;
for (let i = 4; i <= 10; i++) {
    itemsHTML += dummyItem(i, i * 100000000);
}

const finalHTML = beforeList + newCSS + itemsHTML + '\n        </div>\n    ' + afterList;

fs.writeFileSync('public/aktualnosci.html', finalHTML);
console.log("Updated aktualnosci.html successfully.");
