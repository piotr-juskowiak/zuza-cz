const fs = require('fs');
const path = require('path');

const dir = 'public';

// Read all HTML files in public directory
const files = fs.readdirSync(dir).filter(file => file.endsWith('.html'));

const newCSS = `/* --- SIDEBAR & NAV --- */
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: var(--sidebar-width);
            height: 100vh;
            background: white;
            border-right: 1px solid rgba(26, 46, 40, 0.07);
            z-index: 1100;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 2rem 0;
        }

        .sidebar-mail-btn, .sidebar-mail {
            width: 44px;
            height: 44px;
            border: 1px solid var(--accent-gold);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-gold);
            transition: all 0.3s var(--transition);
            background: transparent;
            margin-top: 1rem;
        }

        .sidebar-mail-btn:hover, .sidebar-mail:hover {
            background: var(--accent-gold);
            color: white;
            transform: scale(1.1);
        }

        .sidebar-socials {
            display: none !important; /* Hidden temporarily */
            flex-direction: column;
            gap: 1.8rem;
            align-items: center;
        }

        .sidebar-socials a {
            color: var(--text-primary);
            font-size: 1rem;
            transition: 0.3s;
        }

        .sidebar-socials a:hover {
            color: var(--accent-gold);
            transform: scale(1.15) translateY(-2px);
        }

        .sidebar .sidebar-socials {
            display: none !important; /* Hidden temporarily */
            gap: 1.5rem;
            align-items: center;
        }

        .sidebar .sidebar-socials a {
            width: 38px;
            height: 38px;
            border: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--text-primary);
            background: transparent;
            transition: all 0.3s var(--transition);
        }

        .sidebar .sidebar-socials a:hover,
        .sidebar .sidebar-socials a:focus-visible {
            color: var(--accent-gold);
            background: transparent;
            transform: scale(1.15) translateY(-2px);
        }

        .sidebar-line {
            width: 1px;
            height: 50px;
            background: rgba(26, 46, 40, 0.12);
            margin-top: 1rem;
        }

        .sidebar-socials a svg,
        .sidebar-mail svg,
        .sidebar-mail-btn svg {
            width: 22px;
            height: 22px;
            display: block;
        }

        .sidebar-mail svg,
        .sidebar-mail-btn svg {
            width: 20px;
            height: 20px;
        }
        
        `;

const newHTML = `<aside class="sidebar">
        <a href="mailto:kontakt@zuzanna-czuprynska.pl" class="sidebar-mail" title="Napisz do mnie">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
        </a>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <!--
            <div class="sidebar-socials">
                <a href="https://www.instagram.com/zuzanna_czuprynska/" target="_blank" rel="noopener" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                </a>
                <a href="https://www.facebook.com/zuzia.czuprynska/" target="_blank" rel="noopener" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </a>
                <a href="https://pl.linkedin.com/in/zuzanna-maria-czupry%C5%84ska-829a32355" target="_blank" rel="noopener" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                </a>
            </div>
            -->
            <div class="sidebar-line"></div>
        </div>
    </aside>`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Update CSS
    const cssStart = content.indexOf('/* --- SIDEBAR & NAV --- */');
    if (cssStart !== -1) {
        let cssEnd = content.indexOf('/* Styl dla zdjęcia w sidebarze', cssStart);
        if (cssEnd === -1) {
            cssEnd = content.indexOf('nav {', cssStart);
        }
        if (cssEnd !== -1) {
            content = content.substring(0, cssStart) + newCSS + content.substring(cssEnd);
            modified = true;
        }
    }

    // 2. Update HTML
    const htmlStart = content.indexOf('<aside class="sidebar">');
    if (htmlStart !== -1) {
        const htmlEnd = content.indexOf('</aside>', htmlStart) + '</aside>'.length;
        if (htmlEnd !== -1) {
            content = content.substring(0, htmlStart) + newHTML + content.substring(htmlEnd);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully updated sidebar in ${file}`);
    } else {
        console.log(`No sidebar markers found in ${file}`);
    }
}
