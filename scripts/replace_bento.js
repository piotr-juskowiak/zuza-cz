const fs = require('fs');
let content = fs.readFileSync('public/o-mnie.html', 'utf8');

const startMarker = '<style>\n            /* --- MAGAZINE NEWS SECTION --- */';
const endMarker = '</section>';

const startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
    // Find the end of the news section.
    // The news section is <section id="news" class="section-py news-section">
    // So we search for </section> after the news section starts.
    const sectionStart = content.indexOf('<section id="news"', startIndex);
    let endIndex = content.indexOf('</section>', sectionStart);
    if (endIndex !== -1) {
        endIndex += '</section>'.length;
        
        const bentoHTML = `
<style>
/* --- BENTO EVENTS SECTION --- */
.bento-events-section {
    background: #fdfcf9;
    padding: 8rem 0;
    position: relative;
    border-top: 1px solid rgba(197, 160, 101, 0.15);
}
.bento-heading {
    text-align: center;
    margin-bottom: 5rem;
}
.bento-heading .subtitle {
    justify-content: center;
}
.bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 320px);
    gap: 1.5rem;
}
/* Bento cards */
.bento-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid rgba(26,46,40,0.06);
    overflow: hidden;
    position: relative;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    display: flex;
    flex-direction: column;
    text-decoration: none;
}
.bento-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(26,46,40,0.08);
}
/* Card 1: Large Featured (spans 2x2) */
.bento-large {
    grid-column: span 2;
    grid-row: span 2;
}
/* Card 2: Medium Horizontal (spans 2x1) */
.bento-wide {
    grid-column: span 2;
    grid-row: span 1;
}
/* Card 3 & 4: Small Square (spans 1x1) */
.bento-square {
    grid-column: span 1;
    grid-row: span 1;
}

.bento-img-wrapper {
    position: absolute;
    inset: 0;
    z-index: 0;
}
.bento-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
}
.bento-card:hover .bento-img-wrapper img {
    transform: scale(1.05);
}
.bento-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,18,15,0.85) 0%, rgba(10,18,15,0.2) 50%, transparent 100%);
    z-index: 1;
    transition: background 0.4s ease;
}
.bento-card:hover .bento-overlay {
    background: linear-gradient(to top, rgba(10,18,15,0.95) 0%, rgba(10,18,15,0.25) 60%, transparent 100%);
}
.bento-content {
    position: relative;
    z-index: 2;
    margin-top: auto;
    padding: 2.5rem 2rem;
    color: #fff;
}
.bento-square .bento-content {
    padding: 1.5rem;
}
.bento-meta {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent-gold);
    margin-bottom: 0.8rem;
    display: flex;
    gap: 1rem;
}
.bento-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 0.5rem;
    color: #fff;
}
.bento-wide .bento-title { font-size: 1.8rem; }
.bento-square .bento-title { font-size: 1.4rem; }

.bento-desc {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
}

@media (max-width: 992px) {
    .bento-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
    }
    .bento-large {
        grid-column: span 2;
        grid-row: span 1;
        aspect-ratio: 1;
    }
    .bento-wide {
        grid-column: span 2;
        grid-row: span 1;
        aspect-ratio: 16/9;
    }
    .bento-square {
        grid-column: span 1;
        aspect-ratio: 1;
    }
}
@media (max-width: 600px) {
    .bento-grid {
        grid-template-columns: 1fr;
    }
    .bento-large, .bento-wide, .bento-square {
        grid-column: span 1;
        aspect-ratio: 4/3;
    }
}
</style>

<section class="bento-events-section">
    <div class="container">
        <div class="bento-heading reveal reveal-up">
            <span class="subtitle">Moje działania</span>
            <h2 class="section-title">Najnowsze Wydarzenia</h2>
        </div>

        <div class="bento-grid">
            <!-- 1. Large -->
            <a href="#" class="bento-card bento-large reveal reveal-up">
                <div class="bento-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" alt="Wydarzenie">
                    <div class="bento-overlay"></div>
                </div>
                <div class="bento-content">
                    <div class="bento-meta">
                        <span>Kategoria</span>
                        <span>01 Sty 2026</span>
                    </div>
                    <h3 class="bento-title">Główny temat wydarzenia lub inicjatywy</h3>
                    <p class="bento-desc">Tutaj wpisz krótki opis, który zainteresuje użytkownika i zachęci go do kliknięcia by dowiedzieć się więcej na temat podjętych działań.</p>
                </div>
            </a>

            <!-- 2. Wide -->
            <a href="#" class="bento-card bento-wide reveal reveal-up delay-100">
                <div class="bento-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800" alt="Wydarzenie">
                    <div class="bento-overlay"></div>
                </div>
                <div class="bento-content">
                    <div class="bento-meta">
                        <span>Kategoria</span>
                        <span>01 Sty 2026</span>
                    </div>
                    <h3 class="bento-title">Krótszy tytuł wydarzenia wpisany tutaj</h3>
                </div>
            </a>

            <!-- 3. Square 1 -->
            <a href="#" class="bento-card bento-square reveal reveal-up delay-200">
                <div class="bento-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=600" alt="Wydarzenie">
                    <div class="bento-overlay"></div>
                </div>
                <div class="bento-content">
                    <div class="bento-meta">
                        <span>Kategoria</span>
                    </div>
                    <h3 class="bento-title">Tytuł wydarzenia</h3>
                </div>
            </a>

            <!-- 4. Square 2 -->
            <a href="#" class="bento-card bento-square reveal reveal-up delay-300">
                <div class="bento-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&q=80&w=600" alt="Wydarzenie">
                    <div class="bento-overlay"></div>
                </div>
                <div class="bento-content">
                    <div class="bento-meta">
                        <span>Kategoria</span>
                    </div>
                    <h3 class="bento-title">Tytuł wydarzenia</h3>
                </div>
            </a>
        </div>
    </div>
</section>`;
        
        content = content.substring(0, startIndex) + bentoHTML + content.substring(endIndex);
        fs.writeFileSync('public/o-mnie.html', content);
        console.log("Replaced successfully with Bento layout.");
    } else {
        console.log("Could not find </section> end marker.");
    }
} else {
    console.log("Could not find start marker.");
}
